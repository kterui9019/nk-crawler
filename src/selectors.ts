export const selectors = {
	rows: () => "#All_Result_Table > tbody > tr",
	cols: (row: number) => `#All_Result_Table > tbody > tr:nth-child(${row+1}) > td`,
	header: () => "#All_Result_Table > thead > tr > th"
}
