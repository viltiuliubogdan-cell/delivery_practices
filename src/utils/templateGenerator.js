import * as XLSX from 'xlsx'

export function downloadFinancialForecast() {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Actuals vs Planned
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const avpData = [
    ['Month', 'Planned Cost (€)', 'Actual Cost (€)', 'Variance (€)', 'Variance (%)'],
    ...months.map(m => [m, '', '', '', ''])
  ]
  const ws1 = XLSX.utils.aoa_to_sheet(avpData)
  ws1['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'Actuals vs Planned')

  // Sheet 2: Profitability View
  const profData = [
    ['Month', 'Revenue (€)', 'Total Cost (€)', 'Gross Margin (€)', 'Margin (%)'],
    ...months.map(m => [m, '', '', '', ''])
  ]
  const ws2 = XLSX.utils.aoa_to_sheet(profData)
  ws2['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Profitability View')

  // Sheet 3: Holiday Planning
  const holidayData = [
    ['Team Member', ...months],
    ['', ...months.map(() => '')]
  ]
  const ws3 = XLSX.utils.aoa_to_sheet(holidayData)
  ws3['!cols'] = [{ wch: 20 }, ...months.map(() => ({ wch: 6 }))]
  XLSX.utils.book_append_sheet(wb, ws3, 'Holiday Planning')

  XLSX.writeFile(wb, 'Financial_Forecast_Template.xlsx')
}

export function downloadKnowledgeMatrix() {
  const wb = XLSX.utils.book_new()
  const levels = ['Level 1\n(Awareness)', 'Level 2\n(Basic)', 'Level 3\n(Proficient)', 'Level 4\n(Expert)']

  // Sheet 1: Functional Modules
  const funcData = [
    ['Module', 'Team Member', ...levels],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '']
  ]
  const ws1 = XLSX.utils.aoa_to_sheet(funcData)
  ws1['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'Functional Modules')

  // Sheet 2: Technical Modules
  const techData = [
    ['Module', 'Team Member', ...levels],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '']
  ]
  const ws2 = XLSX.utils.aoa_to_sheet(techData)
  ws2['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Technical Modules')

  XLSX.writeFile(wb, 'Knowledge_Matrix_Template.xlsx')
}
