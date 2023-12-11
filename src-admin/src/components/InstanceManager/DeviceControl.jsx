import { Component } from 'react';
import {
    Button, Fab, IconButton,
    Switch,
} from '@mui/material';
import { renderIcon, getTranslation } from './Utils.jsx';

/**
 * Device Control component
 * @param {object} props - Parameters
 * @param {object} props.control - Control object
 * @param {object} props.socket - Socket object
 * @param {object} props.controlHandler - Control handler to set the state
 * @param {object} props.controlStateHandler - Control handler to read the state
 * @returns {React.JSX.Element|null}
 * @constructor
 */
export default class DeviceControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.control.state?.val,
            ts: props.control.state?.ts,
            ack: props.control.state?.ack,
        };
    }

    componentDidMount() {
        if (this.props.control.stateId) {
            this.props.socket.subscribeState(this.props.control.stateId, this.stateHandler);
        }
    }

    stateHandler = async (id, state) => {
        if (id === this.props.control.stateId && state) {
            // request new state
            const newState = await this.props.controlStateHandler(this.props.deviceId, this.props.control);
            if (newState && newState.ts > this.state.ts) {
                this.setState({
                    value: newState.val,
                    ts: newState.ts,
                    ack: newState.ack,
                });
            }
        }
    };

    componentWillUnmount() {
        if (this.props.control.stateId) {
            this.props.socket.unsubscribeState(this.props.control.stateId, this.stateHandler);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.control.state?.ts > state.ts) {
            return {
                value: props.control.state.val,
                ts: props.control.state.ts,
                ack: props.control.state.ack,
            };
        }

        return null;
    }

    async sendControl(deviceId, control, value) {
        const result = await (this.props.controlHandler(deviceId, control, value)());
        if (result?.ts > this.state.ts) {
            this.setState({
                value: result.val,
                ts: result.ts,
                ack: result.ack,
            });
        }
    }

    renderButton() {
        const tooltip = getTranslation(this.props.control.description);
        const icon = renderIcon(this.props.control, this.props.colors, this.state.value);

        if (!this.props.control.label) {
            return <Fab
                title={tooltip}
                onClick={() => this.sendControl(this.props.deviceId, this.props.control, true)}
            >
                {icon}
            </Fab>;
        }
        return <Button
            title={tooltip}
            onClick={() => this.sendControl(this.props.deviceId, this.props.control, true)}
            startIcon={icon}
        >
            {this.props.control.label}
        </Button>;
    }

    renderSwitch() {
        const tooltip = getTranslation(this.props.control.description);
        // const icon = renderIcon(this.props.control, this.props.colors, this.state.value);

        return <Switch
            title={tooltip}
            checked={this.state.value}
            onChange={e => this.sendControl(this.props.deviceId, this.props.control, e.target.checked)}
        />;
    }

    getColor() {
        let color;
        if (this.state.value) {
            color = this.props.control.colorOn || 'primary';
        } else if (this.props.control.type === 'switch') {
            color = this.props.control.color;
        }
        if (color === 'primary') {
            return this.props.colors.primary;
        }
        if (color === 'secondary') {
            return this.props.colors.secondary;
        }
        return color;
    }

    renderSelect() {

    }

    renderSlider() {

    }

    renderColor() {

    }

    renderIcon() {
        const tooltip = getTranslation(this.props.control.description);
        const icon = renderIcon(this.props.control, this.props.colors, this.state.value);
        const color = this.getColor();

        if (!this.props.control.label) {
            return <Fab
                size="small"
                title={tooltip}
                color={color === this.props.colors.primary ? 'primary' : (color === this.props.colors.secondary ? 'secondary' : undefined)}
                style={color === this.props.colors.primary || color === this.props.colors.secondary ? undefined : { color }}
                onClick={() => this.sendControl(this.props.deviceId, this.props.control, !this.state.value)}
            >
                {icon}
            </Fab>;
        }
        return <Button
            title={tooltip}
            color={color === this.props.colors.primary ? 'primary' : (color === this.props.colors.secondary ? 'secondary' : undefined)}
            style={color === this.props.colors.primary || color === this.props.colors.secondary ? undefined : { color }}
            onClick={() => this.sendControl(this.props.deviceId, this.props.control, !this.state.value)}
            startIcon={icon}
        >
            {this.props.control.label}
        </Button>;
    }

    render() {
        if (this.props.control.type === 'button') {
            return this.renderButton();
        }

        if (this.props.control.type === 'icon') {
            return this.renderIcon();
        }

        if (this.props.control.type === 'switch') {
            return this.renderSwitch();
        }

        return <div style={{ color: 'red' }}>{this.props.control.type}</div>;
    }
}
