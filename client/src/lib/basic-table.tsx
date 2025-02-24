import { FontFamily, FontSize } from '@/enum/setting'
import React from 'react'

type HeadCell = {
    id: string,
    label: string,
    value: string,
}

type BasicTableProps = {
    headCells: Array<HeadCell>,
    tableClass?: string,
    headClass?: string,
    bodyClass?: string,
    data: any,
    nodes: Array<any>
}

const BasicTable: React.FC<BasicTableProps> = ({ headCells, tableClass, headClass, bodyClass, nodes, data }) => {
    return (
        <div className='w-full max-w-[100%] rounded-[10px] overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className={`table-auto w-full text-base text-left text-grey-c700 min-w-[700px] ${tableClass}`}>
                    <thead className={`text-grey-c700 uppercase bg-primary-c100 ${FontFamily.BOLD} ${FontSize.BASE}`}>
                        <tr className="hover:bg-secondary-c100 hover:text-grey-c700">
                            {headCells.map((item: HeadCell, index: number) => {
                                if (index === 0 || index === headCells.length - 1) {
                                    return <th key={item.id} className={`pl-3 py-4 ${headClass}`}>{item.label}</th>
                                }
                                else return <th key={item.id} className={`px-1 py-4 ${headClass}`}>{item.label}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody className={`${FontFamily.MEDIUM} ${FontSize.BASE}`}>
                        {
                            data?.map((item: any, index: number) => {
                                return (
                                    nodes?.map((row_nodes: any, index: number) => {
                                        <tr className="hover:bg-primary-c50 hover:text-grey-c700" key={index}>
                                            {
                                                <>
                                                    {
                                                        row_nodes?.map((node: any, index: number) => {
                                                            if (index === 0) {
                                                                return <td key={index} className={`pl-3 py-4 ${bodyClass}`}>{node}</td>
                                                            }
                                                            else return <td key={index} className={`px-1 py-4 ${bodyClass}`}>{node}</td>
                                                        })
                                                    }
                                                </>
                                            }
                                        </tr>
                                    })
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BasicTable