import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { ActionBase, ActionTypes, Template, RenderedActionArgument } from 'blis-models'
import { State } from '../types'
import * as OF from 'office-ui-fabric-react';
import { onRenderDetailsHeader } from './ToolTips'
import { injectIntl, InjectedIntl, InjectedIntlProps } from 'react-intl'
import { FM } from '../react-intl-messages'
import * as Util from '../util'
import AdaptiveCardViewer from './modals/AdaptiveCardViewer/AdaptiveCardViewer'
import { EntityIdSerializer } from './modals/ActionPayloadEditor'

class ActionDetailsList extends React.Component<Props, ComponentState> {
    constructor(p: any) {
        super(p);
        this.state = {
            columns: getColumns(this.props.intl),
            sortColumn: null,
            cardViewerAction: null
        }
        this.onClickColumnHeader = this.onClickColumnHeader.bind(this);
    }

    sortActions(): ActionBase[] {
        let actions = [...this.props.actions];
        // If column header selected sort the items
        if (this.state.sortColumn) {
            actions
                .sort((a, b) => {
                    const firstValue = this.state.sortColumn.getSortValue(a, this)
                    const secondValue = this.state.sortColumn.getSortValue(b, this)
                    const compareValue = firstValue.localeCompare(secondValue)
                    return this.state.sortColumn.isSortedDescending
                        ? compareValue
                        : compareValue * -1
                })
        }

        return actions;
    }

    onClickColumnHeader(event: any, clickedColumn: IRenderableColumn) {
        let { columns } = this.state;
        let isSortedDescending = clickedColumn.isSortedDescending;

        // If we've sorted this column, flip it.
        if (clickedColumn.isSorted) {
            isSortedDescending = !isSortedDescending;
        }

        // Reset the items and columns to match the state.
        this.setState({
            columns: columns.map(column => {
                column.isSorted = (column.key === clickedColumn.key);

                if (column.isSorted) {
                    column.isSortedDescending = isSortedDescending;
                }

                return column;
            }),
            sortColumn: clickedColumn
        });
    }

    onClickViewCard(action: ActionBase) {
        this.setState({
            cardViewerAction: action
        })
    }

    onClickRow(item: any, index: number, ev: React.FocusEvent<HTMLElement>) {
        // Don't response to row click if it's button that was clicked
        if ((ev.target as any).type !== 'button') {
            let action = item as ActionBase;
            if (this.props.onSelectAction) {
                this.props.onSelectAction(action);
            }
        }
    }

    onCloseCardViewer = () => {
        this.setState({
            cardViewerAction: null
        })
    }

    render() {
        let sortedActions = this.sortActions();

        let template: Template = null;
        let actionArguments: RenderedActionArgument[] = [];
        if (this.state.cardViewerAction) {
            const entityMap = Util.getDefaultEntityMap(this.props.entities)
            const actionPayload = ActionBase.GetPayload(this.state.cardViewerAction, entityMap);
            template = this.props.templates.find((t) => t.name === actionPayload);
            // TODO: This is hack to make adaptive card viewer accept action arguments with pre-rendered values
            actionArguments = ActionBase.GetActionArguments(this.state.cardViewerAction)
                .map(aa => ({
                    ...aa,
                    value: EntityIdSerializer.serialize(aa.value.json, entityMap)
                }))
                .filter(aa => !Util.isNullOrWhiteSpace(aa.value))
        }

        return (
            <div>
                <OF.DetailsList
                    className={OF.FontClassNames.mediumPlus}
                    items={sortedActions}
                    columns={this.state.columns}
                    checkboxVisibility={OF.CheckboxVisibility.hidden}
                    onRenderItemColumn={(action: ActionBase, i, column: IRenderableColumn) => column.render(action, this)}
                    onActiveItemChanged={(item, index, ev) => this.onClickRow(item, index, ev)}
                    onColumnHeaderClick={this.onClickColumnHeader}
                    onRenderDetailsHeader={(detailsHeaderProps: OF.IDetailsHeaderProps,
                        defaultRender: OF.IRenderFunction<OF.IDetailsHeaderProps>) =>
                        onRenderDetailsHeader(detailsHeaderProps, defaultRender)}
                />
                <AdaptiveCardViewer
                    open={this.state.cardViewerAction != null}
                    onDismiss={() => this.onCloseCardViewer()}
                    template={template}
                    actionArguments={actionArguments}
                    hideUndefined={true}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        entities: state.entities,
        templates: state.bot.botInfo && state.bot.botInfo.templates
    }
}

export interface ReceivedProps {
    actions: ActionBase[]
    onSelectAction: (action: ActionBase) => void
}

// Props types inferred from mapStateToProps 
const stateProps = returntypeof(mapStateToProps);
type Props = typeof stateProps & ReceivedProps & InjectedIntlProps

export default connect<typeof stateProps, {}, ReceivedProps>(mapStateToProps, null)(injectIntl(ActionDetailsList))

function getColumns(intl: InjectedIntl): IRenderableColumn[] {
    return [
        {
            key: 'actionResponse',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_RESPONSE,
                defaultMessage: 'Response'
            }),
            fieldName: 'actionResponse',
            minWidth: 200,
            maxWidth: 400,
            isResizable: true,
            isMultiline: true,
            getSortValue: (action, component) => ActionBase.GetPayload(action, Util.getDefaultEntityMap(component.props.entities)),
            render: (action, component) => {
                const entityMap = Util.getDefaultEntityMap(component.props.entities)
                const args = ActionBase.GetActionArguments(action)
                    .map<string>(aa => EntityIdSerializer.serialize(aa.value.json, entityMap))
                    .filter(aa => !Util.isNullOrWhiteSpace(aa))

                return (
                    <div>
                        {action.actionType === ActionTypes.CARD &&
                            <OF.PrimaryButton
                                className="blis-button--viewCard"
                                onClick={() => component.onClickViewCard(action)}
                                ariaDescription="ViewCard"
                                text=""
                                iconProps={{ iconName: 'RedEye' }}
                            />
                        }
                        <span 
                            className={OF.FontClassNames.mediumPlus} 
                            onClick={() => component.props.onSelectAction ? component.props.onSelectAction(action) : null}
                        >
                            {ActionBase.GetPayload(action, entityMap)}
                        </span>
                        {args.length !== 0 &&
                            args.map((argument, i) => <div className="ms-ListItem-primaryText" key={i}>{argument}</div>)
                        }
                    </div>
                )
            }
        },
        {
            key: 'actionType',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_TYPE,
                defaultMessage: 'Action Type'
            }),
            fieldName: 'metadata',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            getSortValue: action => action.actionType.toLowerCase(),
            render: action => <span className={OF.FontClassNames.mediumPlus}>{action.actionType}</span>
        },
        {
            key: 'requiredEntities',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_REQUIREDENTITIES,
                defaultMessage: 'Required Entities'
            }),
            fieldName: 'requiredEntities',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            // TODO: Previous implementation returned arrays for these which is incorrect.
            // Should be action.negativeEntities.join('').toLowerCase(), but need entity names which requires lookup
            // This lookup should be done ahead of time instead of on every render
            getSortValue: action => '',
            render: (action, component) => action.requiredEntities.length === 0
                ? <OF.Icon iconName="Remove" className="blis-icon" />
                : action.requiredEntities.map(entityId => {
                    const entity = component.props.entities.find(e => e.entityId === entityId)
                    return (
                        <div className='ms-ListItem is-selectable' key={entityId}>
                            <span className='ms-ListItem-primaryText'>{entity.entityName}</span>
                        </div>
                    )
                })
        },
        {
            key: 'negativeEntities',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_BLOCKINGENTITIES,
                defaultMessage: 'Blocking Entities'
            }),
            fieldName: 'negativeEntities',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            // TODO: Previous implementation returned arrays for these which is incorrect.
            // Should be action.negativeEntities.join('').toLowerCase(), but need entity names which requires lookup
            // This lookup should be done ahead of time instead of on every render
            getSortValue: action => '',
            render: (action, component) => action.negativeEntities.length === 0
                ? <OF.Icon iconName="Remove" className="blis-icon" />
                : action.negativeEntities.map(entityId => {
                    const entity = component.props.entities.find(e => e.entityId == entityId)
                    return (
                        <div className='ms-ListItem is-selectable' key={entityId}>
                            <span className='ms-ListItem-primaryText'>{entity.entityName}</span>
                        </div>
                    )
                })
        },
        {
            key: 'suggestedEntity',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_SUGGESTEDENTITY,
                defaultMessage: 'Expected Entity'
            }),
            fieldName: 'suggestedEntity',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            getSortValue: action => '',
            render: (action, component) => {
                if (!action.suggestedEntity) {
                    return <OF.Icon iconName="Remove" className="blis-icon" />
                }

                const expectedEntity = component.props.entities.find(e => e.entityId === action.suggestedEntity)
                return (
                    <div className='ms-ListItem is-selectable'>
                        <span className='ms-ListItem-primaryText'>{expectedEntity.entityName}</span>
                    </div>
                )
            }
        },
        {
            key: 'isTerminal',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_ISTERMINAL,
                defaultMessage: 'Wait'
            }),
            fieldName: 'isTerminal',
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            getSortValue: action => action.isTerminal ? 'a' : 'b',
            render: action => <OF.Icon iconName={action.isTerminal ? 'CheckMark' : 'Remove'} className="blis-icon" />
        }
    ]
}

interface IRenderableColumn extends OF.IColumn {
    render: (action: ActionBase, component: ActionDetailsList) => JSX.Element | JSX.Element[]
    getSortValue: (action: ActionBase, component: ActionDetailsList) => string
}

interface ComponentState {
    columns: IRenderableColumn[]
    sortColumn: IRenderableColumn,
    cardViewerAction: ActionBase
}