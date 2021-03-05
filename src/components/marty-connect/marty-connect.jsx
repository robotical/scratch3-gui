/* eslint-disable no-warning-comments */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable require-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import VM from 'scratch-vm';
import errorBoundaryHOC from '../../lib/error-boundary-hoc.jsx';
import { activateTab, BLOCKS_TAB_INDEX } from '../../reducers/editor-tab';
import Button from '../button/button.jsx';
import Input from '../forms/input.jsx';
import styles from './marty-connect.css';
import collectMetadata from '../../lib/collect-metadata';
import { requestNewProject } from '../../reducers/project-state';
import settingIcon from '../../lib/assets/icon--settings.svg'


class MartyConnect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ipAddress: '',
            isValidIpAddress: false,
            ipAddresses: [],
            isConnected: mv2.isConnected,
        };
        this.setIpAddress = this.setIpAddress.bind(this);
        this.doConnect = this.doConnect.bind(this);
        this.doDisconnect = this.doDisconnect.bind(this);
        this.connStateChanged = this.connStateChanged.bind(this);
        this.connectionFailed = this.connectionFailed.bind(this);
        this.getIpAddresses();
        this.addonList = {addons:[]};
        mv2.addEventListener('onIsConnectedChange', this.connStateChanged);
        mv2.addEventListener('connectionFailed', this.connectionFailed);
    }

    componentWillUnmount() {
        mv2.removeEventListener('onIsConnectedChange', this.connStateChanged);
        mv2.removeEventListener('connectionFailed', this.connectionFailed);
    }

    async getIpAddresses() {
    }

    connStateChanged(event) {
        this.setState({ isConnected: event.isConnected });
    }

    connectionFailed(event) {
        // eslint-disable-next-line no-alert
        // alert(`Failed to connect`);
    }

    async getAddonInfo() {
        try {
            this.addonList = JSON.parse(mv2.getHWElemList());
            
        } catch (error) {
            console.log('eventConnect - failed to get HWElems ' + error);
        }
    }

    async doConnect(ipAddress) {

        try {
            if (await mv2.connect(ipAddress)) {
                // Move to the blocks tab now we are connected
                this.props.onActivateBlocksTab();
                // console.log(mv2);
                mv2.convertHWElemType();
                this.getAddonInfo();

            }
        } catch (error) {
            // eslint-disable-next-line no-alert
            alert(`Failed to connect ${error.message}`);
        }
    }

    async doDisconnect() {

        try {
            if (await mv2.disconnect()) {
            }
        } catch (error) {
            // eslint-disable-next-line no-alert
            alert(`Failed to disconnect ${error.message}`);
        }
    }

    setIpAddress(ipAddress) {
        const isValidIpAddress = ipAddress.length > 0;
        this.setState({ ipAddress, isValidIpAddress });
    }

    processAddonInfo(){
        this.getAddonInfo();
        const { addons } = this.addonList;
        addons.map((addon, i) => {
            // console.log("addon.deviceTypeID: " + addon.deviceTypeID)
            addon.addOnType = mv2.convertHWElemType(addon.deviceTypeID);
            // console.log("addon.addOnType: " + addon.addOnType)

        });
    }



    render() {
        this.processAddonInfo();
        const { ipAddress, isValidIpAddress, isConnected } = this.state;
        const { addons } = this.addonList;
        // console.log(this.addonList);
        return (
            <div
                className={styles.mainContent}
            >
                <div className={styles.block}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {isConnected &&
                            <div className={styles.connect_line}>
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                            <div className={styles.label}>Marty is connected, IP Address: {mv2.ipAddress}</div>
                                <button
                                    className={styles.button}
                                    style={{ marginLeft:20, marginRight: 5 }}
                                    onClick={() => this.doDisconnect()}
                                >
                                    Disconnect
                                </button>
                            </div>
                            </div>
                        }
                        {!isConnected &&
                            <div className={styles.connect_line}>
                                <div className={styles.label}>Marty's IP Address:</div>
                                <Input
                                    className={styles.connect_text}
                                    type="text"
                                    value={ipAddress}
                                    onChange={event =>
                                        this.setIpAddress(event.currentTarget.value)
                                    }
                                />
                                <Button
                                    style={{opacity: isValidIpAddress ? 1 : 0.2 }}
                                    className={styles.button}
                                    disabled={!isValidIpAddress}
                                    onClick={() => this.doConnect(ipAddress)}
                                >
                                    Connect
                                </Button>
                            </div>
                        }
                    </div>
                </div>
                {!isConnected && 
                        <div className={styles.block}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className={styles.connectInfo}>You can find Marty's IP address by connecting to the app, full instructions can be found &nbsp;
                                <a href="https://userguides.robotical.io/martyv2/userguides/wifi#connection_status">here.</a></div>
                                <div className={styles.connectInfo}>You need to make sure Marty and this device are connected to the same WiFi network</div>
                                <div className={styles.connectInfo}>If you are unsure as to how to connect Marty to your WiFi newtork, our user guide can be found &nbsp;
                                <a href ="https://userguides.robotical.io/martyv2/userguides/wifi">here</a></div>
                                
                            </div>
                        </div>
                }
                { isConnected && addons.length > 0 &&
                    <div
                        className={styles.block}
                        style={{flex: 1}}
                    >
                        
                        <div className={styles.addons}>
                            <div className={styles.addon_title}>Your Connected Addons:</div>
                            {addons.sort().map((key, index) => (
                                <div
                                    key={index}
                                    className={(index % 2) === 0 ? styles.evenRow : styles.oddRow}
                                >
                                    <div className={styles.addon_name}>
                                        {key.name}
                                    </div>
                                    <div className={styles.addon_divider}>
                                        -
                                    </div>
                                    <div className={styles.addon_type}>
                                        {key.addOnType}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        );
    }
}


 


MartyConnect.propTypes = {
    onActivateBlocksTab: PropTypes.func,
    saveProjectSb3: PropTypes.func,
    editingTarget: PropTypes.string,
    locale: PropTypes.string.isRequired,
    onProjectTelemetryEvent: PropTypes.func,
    projectTitle: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired,
    onConfirmNewProject: PropTypes.func,
};

const mapStateToProps = state => ({
    locale: state.locales.locale,
});



const mapDispatchToProps = dispatch => ({
    onActivateBlocksTab: () => dispatch(activateTab(BLOCKS_TAB_INDEX)),
});

export default errorBoundaryHOC('Connect')(
    injectIntl(connect(mapStateToProps, mapDispatchToProps)(MartyConnect))
);


//   <div className={styles.icon_column}>
//     <img
//         draggable={false}
//         src={settingIcon}
//     />
// </div> 