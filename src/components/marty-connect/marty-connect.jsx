/* eslint-disable no-warning-comments */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable require-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import VM from 'scratch-vm';
import errorBoundaryHOC from '../../lib/error-boundary-hoc.jsx';
import {activateTab, BLOCKS_TAB_INDEX} from '../../reducers/editor-tab';
import Button from '../button/button.jsx';
import Input from '../forms/input.jsx';
import styles from './marty-connect.css';
import collectMetadata from '../../lib/collect-metadata';
import {requestNewProject} from '../../reducers/project-state';

class MartyConnect extends React.Component {
    constructor (props) {
        super(props);
        this.state = {ipAddress: '', isValidIpAddress: false, ipAddresses: []};
        this.setIpAddress = this.setIpAddress.bind(this);
        this.getIpAddresses();
    }

    async getIpAddresses() {
    }

    setIpAddress(ipAddress) {
        const isValidIpAddress = ipAddress.length > 0;
        this.setState({ipAddress, isValidIpAddress});
    }
    
    render () {
        const {ipAddress, isValidIpAddress, ipAddresses} = this.state;
        return (
            <div
                className={styles.mainContent}
            >
                <div className={styles.block}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        { mv2.isConnected &&
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: 10}}>
                                <button
                                    className={styles.button}
                                    style={{marginRight: 5}}
                                    onClick={() => {
                                        }
                                    }
                                >
                                    Disconnect
                                </button>
                            </div>
                        }
                        { !mv2.isConnected &&
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: 10}}>
                                <div>Marty's IP Address:</div>
                                <Input
                                    style={{flex: 1, marginLeft: 10}}
                                    type="text"
                                    value={ipAddress}
                                    onChange={event =>
                                        this.setIpAddress(event.currentTarget.value)
                                    }
                                />
                                <Button
                                    style={{marginLeft: 10, marginRight: 5, opacity: isValidIpAddress ? 1 : 0.2}}
                                    className={styles.button}
                                    disabled={!isValidIpAddress}
                                    onClick={() => { mv2.connect(); }}
                                >
                                    Connect
                                </Button>
                            </div>
                        }
                    </div>
                </div>
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
});

const mapDispatchToProps = dispatch => ({
});

export default errorBoundaryHOC('Connect')(
    injectIntl(connect(mapStateToProps, mapDispatchToProps)(MartyConnect))
);
