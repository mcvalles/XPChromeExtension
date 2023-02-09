const request = async ({ path, method, token, body }) => {
  const opts = {
    method,
    async: true,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
    contentType: 'json',
    body: body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(path, opts)
  const data = await response.json()

  return data;
}

const getSpreadsheetId = (spreadsheet) => {
  const matches = spreadsheet.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/(.*)?/)
  return matches ? matches[1] : null
}

const getSheetId = async ({ spreadsheetId, token }) => {
  const data = await request({
    method: 'GET',
    path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?&fields=sheets.properties`,
    token,
  })

  return data?.sheets?.[0]?.properties.sheetId
}

const setSpreadsheet = async () => {
  const { save: { spreadsheet } } = await chrome.storage.sync.get('save')
  
  if(spreadsheet) {
    const { googleAuthToken } = await chrome.storage.sync.get('googleAuthToken')

    const spreadsheetId = getSpreadsheetId(spreadsheet)
    
    if(spreadsheetId)  {
      try {
        const data = await request({
          method: 'GET',
          path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?ranges=D14:D&majorDimension=COLUMNS`,
          token: googleAuthToken,
        })

        if(data?.valueRanges?.[0]?.values?.[0]) {
          const spreadsheetLinkedins = data.valueRanges[0].values[0].filter(linkedinlData => 
              linkedinlData.includes('linkedin'))

          await chrome.storage.sync.set({
            spreadsheetLinkedins
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
} 

const getNextEmptyIndex = async ({ spreadsheetId, token }) => {
  const startingIndex = 14;

  const data = await request({
    method: 'GET',
    path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A${startingIndex}:I`,
    token,
  })

  const firstEmptyRowIndex = data.values.findIndex(row => row?.[0] === '')

  if(firstEmptyRowIndex === -1) {
    const sheetId = await getSheetId({ spreadsheetId, token })

    const newRowIndex = (data.values.length - 1) + startingIndex

    const params = {
      "requests": [
        {
          "insertDimension": {
            "range": {
              "sheetId": sheetId,
              "dimension": "ROWS",
              "startIndex": newRowIndex,
              "endIndex": newRowIndex + 1
            },
            "inheritFromBefore": true
          }
        },
      ],
    }

    await request({
      method: 'POST',
      path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      token,
      body: params
    })

    return newRowIndex
  }

  return firstEmptyRowIndex + startingIndex
}

const addUserOnSpreadsheet = async data => {
  const { save: { spreadsheet } } = await chrome.storage.sync.get('save')

  if(!spreadsheet) {
    return {
      error: true,
      message: 'Spreadsheet url is not set on extension\'s options, please, add a valid spreadsheet url before continue.'
    }
  }

  const spreadsheetId = getSpreadsheetId(spreadsheet)

  const { googleAuthToken } = await chrome.storage.sync.get('googleAuthToken')
  
  const { name, email, userProfileUrl, linkedin } = data

  const index = await getNextEmptyIndex({ spreadsheetId, token: googleAuthToken})
  const row = index + 1;

  const params = {
    values: [
      [ 
        name, // A
        email, // B
        userProfileUrl || '', // C
        linkedin, // D 
        '', // E
        '', // F
        '', // G
        '', // H
        `=((((N${row}*Agenda!$A$4)+(O${row}*Agenda!$B$4)+(P${row}*Agenda!$C$4)+(Q${row}*Agenda!$D$4))+((S${row}*Agenda!$A$13)+(U${row}*Agenda!$B$13)+(T${row}*Agenda!$C$13)))*100)*2.33`, // I
        '', // J
        '', // K
        '', // L
        '', // M
        `=COUNTIF(H${row},"S")`, // N
        `=COUNTIF(H${row},"A")`, // O
        `=COUNTIF(H${row},"B")`, // P
        `=COUNTIF(H${row},"C")`, // Q
        '', // R
        `=COUNTIF(G${row},"S")`, // S
        `=COUNTIF(G${row},"C")`, // T
        `=COUNTIF(G${row},"A")` // U
      ]
    ]
  }

  try {
    await request({
      method: 'POST',
      path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A${index}:D${index}:append?valueInputOption=USER_ENTERED`,
      token: googleAuthToken,
      body: params
    })

    await setSpreadsheet()

    return {
      success: true,
      message: `${name} successfully added on Sheet.`
    }
  } catch (error) {
    console.log(error)

    return {
      error: true,
      message: `There was an error on trying to add ${name} on Sheet, please try again.`
    }
  }
} 

async function Spreadsheet(Core) {
  console.log('XCE :: Core :: Loading Spreadsheet')
  await setSpreadsheet()

  return {
    module: 'Spreadsheet',
    addUserOnSpreadsheet
  }
}

export default Spreadsheet
