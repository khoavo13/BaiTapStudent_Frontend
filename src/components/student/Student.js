import React, { useEffect, useState } from 'react'
import { Button, Table } from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux';
import { getAlll } from '../../redux/studentSlice';
import ReactPaginate from 'react-paginate';
export default function Student() {
    const [currentPage, setCurrentPage] = useState(0)
    const limit = 5
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAlll({ currentPage, limit }))
    }, [currentPage])
    const {totalPages,students}=useSelector((state)=>state.student)
    const handlePageClick=(event)=>{
        setCurrentPage(event.selected)
    }
    return (
        <div>
            <h1>Total: {totalPages}</h1>
            <Table striped>
                <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            Tên sinh viên
                        </th>
                        <th>
                            Thành phố
                        </th>
                        <th>
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                   
                    {
                        students&&students.map((item,index)=>(
                            <tr key={index}>
                                <td>{index+1}</td>
                            <td scope="row">
                                {item.ten}
                            </td>
                            <td>
                                {item.thanhPho}
                            </td>
                            <td>
                               <Button className='btn btn-danger'>Delete </Button>
                            </td>
                          
                        </tr>
                        ))
                    }
                   
                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={Math.ceil(totalPages)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </div>
    )
}
