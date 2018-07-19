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
        "$k": "0",
        "$kk": "0,",
        "$p": "",
        "__holders": {
          "0": [
            0,
            1,
            2
          ],
          "1-0": 111,
          "1-1": 222,
          "1-2": 333
        },
        "__indexMap": ""
      }
    }
  }
}

export {
  getListData,
  getAppDataSingleHolder,
  getAppData
}
