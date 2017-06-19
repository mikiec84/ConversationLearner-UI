import * as React from 'react';
import { createAction } from '../actions/create';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { CommandButton, Dialog, DialogFooter, DialogType, ChoiceGroup, TextField, DefaultButton, Dropdown, TagPicker, Label } from 'office-ui-fabric-react';
import { Action, ActionMetadata } from '../models/Action';
import { ActionTypes } from '../models/Constants';
import { Entity } from '../models/Entity';
interface EntityPickerObject {
    key: string
    name: string
}
class ActionResponseCreator extends React.Component<any, any> {
    constructor(p: any) {
        super(p);
        this.state = {
            open: false,
            actionTypeVal: 'TEXT',
            contentVal: '',
            reqEntitiesVal: [],
            negEntitiesVal: [],
            waitVal: false,
            waitKey: 'waitFalse',
            availableRequiredEntities: [],
            availableNegativeEntities: []
        }
    }
    componentWillUpdate() {
        if (this.state.availableRequiredEntities.length != this.props.entities.length) {
            let entities = this.props.entities.map((e: Entity) => {
                return {
                    key: e.name,
                    name: e.name
                }
            })
            this.setState({
                availableRequiredEntities: entities
            })
        }
        if (this.state.availableNegativeEntities.length != this.props.entities.length) {
            let entities = this.props.entities.map((e: Entity) => {
                return {
                    key: e.name,
                    name: e.name
                }
            })
            this.setState({
                availableNegativeEntities: entities
            })
        }
    }
    handleOpen() {
        this.setState({
            open: true
        })
    }
    handleClose() {
        this.setState({
            open: false,
            actionTypeVal: 'TEXT',
            contentVal: '',
            reqEntitiesVal: [],
            negEntitiesVal: [],
            waitVal: false,
            waitKey: 'waitFalse',
            availableRequiredEntities: [],
            availableNegativeEntities: []
        })
    }
    generateGUID(): string {
        let d = new Date().getTime();
        let guid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (char == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return guid;
    }
    createAction() {
        let randomGUID = this.generateGUID();
        let requiredEntities = this.state.reqEntitiesVal.map((req: EntityPickerObject) => {
            return this.props.entities.find((e: Entity) => e.name == req.key);
        })
        let negativeEntities = this.state.negEntitiesVal.map((neg: EntityPickerObject)  => {
            return this.props.entities.find((e: Entity) => e.name == neg.key);
        })
        let internal = this.state.actionTypeVal == 'TEXT' ? true : false;
        let meta = new ActionMetadata(internal, null)
        let actionToAdd = new Action(randomGUID, this.state.actionTypeVal, this.state.contentVal, negativeEntities, requiredEntities, this.state.waitVal, meta, this.props.blisApps.current.modelID);
        this.props.createAction(actionToAdd);
        this.handleClose();
    }
    waitChanged(event: any, option: { text: string }) {
        if (option.text == 'False') {
            this.setState({
                waitVal: false,
                waitKey: 'waitFalse'
            })
        } else {
            this.setState({
                waitVal: true,
                waitKey: 'waitTrue'
            })
        }
    }
    actionTypeChanged(obj: { text: string }) {
        this.setState({
            actionTypeVal: obj.text,
        })
    }
    contentChanged(text: string) {
        this.setState({
            contentVal: text
        })
    }
    onFilterChanged(filterText: string, tagList: EntityPickerObject[]) {
        let entList = filterText ? this.state.availableRequiredEntities.filter((ent: EntityPickerObject)  => ent.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0).filter((item: EntityPickerObject)  => !this.listContainsDocument(item, tagList)) : [];
        return entList;
    }

    listContainsDocument(tag: EntityPickerObject, tagList: EntityPickerObject[]) {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.filter(compareTag => compareTag.key === tag.key).length > 0;
    }
    onFilterChangedNegative(filterText: string, tagList: EntityPickerObject[]) {
        let entList = filterText ? this.state.availableNegativeEntities.filter((ent: EntityPickerObject)  => ent.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0).filter((item: EntityPickerObject)  => !this.listContainsDocumentNegative(item, tagList)) : [];
        return entList;
    }

    listContainsDocumentNegative(tag: EntityPickerObject, tagList: EntityPickerObject[]) {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.filter(compareTag => compareTag.key === tag.key).length > 0;
    }
    handleChangeRequiredEntities(items: EntityPickerObject[]) {
        this.setState({
            reqEntitiesVal: items
        })
    }
    handleChangeNegativeEntities(items: EntityPickerObject[]) {
        this.setState({
            negEntitiesVal: items
        })
    }
    render() {
        let actionTypeVals = Object.values(ActionTypes);
        let actionTypeOptions = actionTypeVals.map(v => {
            return {
                key: v,
                text: v
            }
        })
        return (
            <div className='actionResponseCreator'>
                <CommandButton
                    data-automation-id='randomID5'
                    disabled={false}
                    onClick={this.handleOpen.bind(this)}
                    className='goldButton'
                    ariaDescription='Create a New Action'
                    text='New Action'
                />
                <Modal
                    isOpen={this.state.open}
                    onDismiss={this.handleClose.bind(this)}
                    isBlocking={false}
                    containerClassName='createModal'
                >
                    <div className='modalHeader'>
                        <span className='ms-font-xxl ms-fontWeight-semilight'>Create an Action</span>
                    </div>
                    <div>
                        <Dropdown
                            label='Action Type'
                            options={actionTypeOptions}
                            onChanged={this.actionTypeChanged.bind(this)}
                            selectedKey={this.state.actionTypeVal}
                        />
                        <TextField
                            onChanged={this.contentChanged.bind(this)}
                            label="Content"
                            placeholder="Content..."
                            value={this.state.contentVal} />
                        <Label>Required Entities</Label>
                        <TagPicker
                            onResolveSuggestions={this.onFilterChanged.bind(this)}
                            getTextFromItem={(item) => { return item.name; }}
                            onChange={this.handleChangeRequiredEntities.bind(this)}
                            pickerSuggestionsProps={
                                {
                                    suggestionsHeaderText: 'Entities',
                                    noResultsFoundText: 'No Entities Found'
                                }
                            }
                        />
                        <Label>Negative Entities</Label>
                        <TagPicker
                            onResolveSuggestions={this.onFilterChangedNegative.bind(this)}
                            getTextFromItem={(item) => { return item.name; }}
                            onChange={this.handleChangeNegativeEntities.bind(this)}
                            pickerSuggestionsProps={
                                {
                                    suggestionsHeaderText: 'Entities',
                                    noResultsFoundText: 'No Entities Found'
                                }
                            }
                        />
                        <ChoiceGroup
                            defaultSelectedKey='waitFalse'
                            options={[
                                {
                                    key: 'waitTrue',
                                    text: 'True',
                                },
                                {
                                    key: 'waitFalse',
                                    text: 'False',
                                }
                            ]}
                            label='Wait For Response?'
                            onChange={this.waitChanged.bind(this)}
                            selectedKey={this.state.waitKey}
                        />
                    </div>
                    <div className='modalFooter'>
                        <CommandButton
                            data-automation-id='randomID6'
                            disabled={false}
                            onClick={this.createAction.bind(this)}
                            className='goldButton'
                            ariaDescription='Create'
                            text='Create'
                        />
                        <CommandButton
                            data-automation-id='randomID7'
                            className="grayButton"
                            disabled={false}
                            onClick={this.handleClose.bind(this)}
                            ariaDescription='Cancel'
                            text='Cancel'
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        createAction: createAction
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        actions: state.actions,
        blisApps: state.apps,
        entities: state.entities
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActionResponseCreator);