function getAppDataSingleHolder(data) {
  return {
    $root: {
      0: {
        $k: '0',
        $kk: '0,',
        $p: '',
        __holders: {
          0: data
        },
        __indexMap: ""
      }
    }
  }
}

function getAppData(data) {
  return {
    $root: {
      0: {
        $k: '0',
        $kk: '0,',
        $p: '',
        __holders: data,
        __indexMap: ""
      }
    }
  }
}


function getListData() {
  return {
    $root: {
      0: {
        items: [111, 222, 333],
        $k: '0',
        $kk: '0,',
        $p: ''
      },
      '0,1-0': {
        info: 111,
        $k: '0,1-0',
        $kk: '0,1-0,',
        $p: '0'
      },
      '0,1-1': {
        info: 222,
        $k: '0,1-1',
        $kk: '0,1-1,',
        $p: '0'
      },
      '0,1-2': {
        info: 333,
        $k: '0,1-2',
        $kk: '0,1-2,',
        $p: '0'
      }
    }
  }
}

export {
  getListData,
  getAppDataSingleHolder,
  getAppData
}
