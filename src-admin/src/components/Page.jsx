import {
    Grid,
    Paper,
} from '@mui/material';

import TopBar from './TopBar';
import DeviceList from './InstanceManager/index.jsx';
import { getTranslation } from './InstanceManager/Utils.jsx';
import Communication from './InstanceManager/Communication.jsx';

/**
 * Page - Main page
 * @param {object} params - Parameters
 * @param {object} params.socket - Socket object
 * @param {object} params.uploadImagesToInstance - Instance to upload images to
 * @returns {Element}
 * @constructor
 */
export default class Page extends Communication {
    constructor(props) {
        super(props);

        this.state.selectedInstance = window.localStorage.getItem('dm.selectedInstance') || '';
        this.state.filter = '';
    }

    renderContent() {
        /** @type {object} */
        const gridStyle = {
            justifyContent: 'center',
            alignItems: 'stretch',
        };
        /** @type {object} */
        const emptyStyle = {
            padding: 25,
        };

        // TODO: Show toast while action cannot be executed because of broken session or reload page

        return <div className="App-header" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Paper elevation={1} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <TopBar
                    selectedInstance={this.state.selectedInstance}
                    setSelectedInstance={selectedInstance => {
                        window.localStorage.setItem('dm.selectedInstance', selectedInstance);
                        this.setState({ selectedInstance });
                    }}
                    filter={this.state.filter}
                    setFilter={filter => this.setState({ filter })}
                    socket={this.props.socket}
                    instanceHandler={this.instanceHandler}
                />
                <div style={{ width: '100%', height: 'calc(100% - 58px)', overflow: 'auto' }}>
                    <Grid container style={gridStyle}>
                        {!this.state.selectedInstance && <div style={emptyStyle}>
                            <span>{getTranslation('noInstanceSelectedText')}</span>
                        </div>}
                        <DeviceList
                            empbedded
                            uploadImagesToInstance={this.props.uploadImagesToInstance}
                            selectedInstance={this.state.selectedInstance}
                            filter={this.state.filter}
                            socket={this.props.socket}
                        />
                    </Grid>
                </div>
            </Paper>
        </div>;
    }
}
