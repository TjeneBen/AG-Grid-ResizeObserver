import React, { Component } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { columnDefs } from './data/columnDefs';
import { rowData } from './data/rowData';
import { columnState } from './data/columnState';
import agModules from './agGridModules';

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };

    this.gridRef = React.createRef();

   
    this.defaultColDef = this.getDefaultColDef();


    this.autoGroupColumnDef = {
      pinned: 'left',
      enableRowGroup: false,
      enableValue: false,   
    };

    this.aggFuncs = {    
      firstFilled: firstFilled,  
    };

    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
          },
          width: 301
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
          width: 301
        }
      ]
    };
  }

  getDefaultColDef = () => {
    return {
      cellClass: 'default',
      enableRowGroup: true,
      enableValue: true,
      suppressHeaderMenuButton: false,
      sortable: true,
      enablePivot: true,
      cellDataType: false,
      filter: 'agSetColumnFilter',
      filterParams: {
        newRowsAction: 'keep',
        buttons: ['clear']
      },
      floatingFilter: true,
      resizable: true,
      allowedAggFuncs: [ 
        'firstFilled',
      ],     
    };
  };

  // set grid api internally then pass to parent
  onGridReady = (params) => {
    this.props.onGridReady(params);
  };

  toggleInitialReady = () => {
    if (!this.state.ready) {
      this.setState({
        ready: true,
      });
    }
  };

  triggerStateLoad = (e) => {
    this.gridRef.current.api.applyColumnState({
      state: columnState,
      applyOrder: true
    });
  };

  onFirstDataRendered = (e) => {
    this.toggleInitialReady();
    this.triggerStateLoad(e);
  };

  render() {
    let divHeight = '500px';
    let classList = ['ag-theme-material', 'ag-size-l'];
   
    return (
      <div
        className={classList.join(' ')}
        style={{
          height: divHeight,
          minHeight: '228px',
          textAlign: 'left',
          border: '1px solid #bdc3c7'
        }}
      >

        <AgGridReact
          ref={this.gridRef}
          columnDefs={columnDefs}
          defaultColDef={this.defaultColDef}
          rowData={rowData}
          groupDefaultExpanded={0}
          autoGroupColumnDef={this.autoGroupColumnDef}
          rowGroupPanelShow='onlyWhenGrouping'
          pivotPanelShow='always'
          aggFuncs={this.aggFuncs}
          suppressAggFuncInHeader={false}
          getContextMenuItems={this.getContextMenuItems}
          modules={agModules}
          sideBar={this.sideBar}
          onFirstDataRendered={this.onFirstDataRendered}
          pivotMode={true}
          pivotDefaultExpanded={-1} 
        />

      </div>

    );
  }
}

export default Grid;

function firstFilled(params) {
  let values = params.values || [];
  return find(values, n => typeof n !== 'undefined' && n !== null && n !== '');

}
