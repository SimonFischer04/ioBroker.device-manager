// import Connection from "@iobroker/adapter-react-v5/Connection";
import React from 'react';
import JsonConfigComponent from '@iobroker/adapter-react-v5/Components/JsonConfigComponent';

// import { JsonFormData, JsonFormSchema } from "@jey-cee/dm-utils";

export function JsonConfig(props) {
	const { instanceId, context, schema, data, onChange } = props;
	console.log('JsonConfig', props);
	if (schema === undefined) {
		return null;
	}
	const [error, setError] = React.useState();

	const [adapterName, instance] = instanceId.split('.', 2);

	return <>
		{error && <div>{error}</div>}
		<JsonConfigComponent
			socket={context.socket}
			adapterName={adapterName}
			instance={parseInt(instance)}
			schema={schema}
			data={data}
			onError={setError}
			onChange={(data, _changed) => {
				onChange(data);
			}}
		/>
	</>;
	/*
    JSON adapter config:
			className={classes.scroll}
			socket={socket}
			theme={this.props.theme}
			themeName={this.props.themeName}
			themeType={this.props.themeType}
			adapterName={this.props.adapterName}
			instance={this.props.instance}
			isFloatComma={this.props.isFloatComma}
			dateFormat={this.props.dateFormat}
			schema={this.state.schema}
			common={this.state.common}
			data={this.state.data}
			updateData={this.state.updateData}
			onError={(error) => this.setState({ error })}
			onChange={(data, changed) => this.setState({ data, changed })}
			customs={{ configCustomEasyAccess: ConfigCustomEasyAccess }}
    Object custom:
            instanceObj={instanceObj}
            customObj={customObj}
            custom={true}
            className={ '' }
            adapterName={adapter}
            instance={parseInt(instance.split('.').pop(), 10) || 0}
            socket={this.props.socket}
            theme={this.props.theme}
            themeName={this.props.themeName}
            themeType={this.props.themeType}
            multiEdit={this.props.objectIDs.length > 1}

            schema={this.jsonConfigs[adapter].json}
            data={data}
            onError={error =>
                this.setState({error}, () => this.props.onError && this.props.onError(error))}
            onValueChange={(attr, value) => {
                console.log(attr + ' => ' + value);
                const newValues = JSON.parse(JSON.stringify(this.state.newValues));
                newValues[instance] = newValues[instance] || {};
                if (this.commonConfig[instance][attr] === value) {
                    delete newValues[instance][attr];
                    if (!Object.keys(newValues[instance]).length) {
                        delete newValues[instance];
                    }
                } else {
                    newValues[instance][attr] = value;
                }
                this.setState({newValues, hasChanges: this.isChanged(newValues)}, () =>
                    this.props.onChange && this.props.onChange(this.state.hasChanges));
            }}*/
}
