import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewStudent, deleteStudent, getAll, resetStatusAndMessage } from "../../redux/studentSlice";
import ReactPaginate from "react-paginate";
import {
    Alert,
  Button,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";
import { toast } from "react-toastify";
export default function Student() {
  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal)
    if (modal){
        dispatch(resetStatusAndMessage())
    }
  };
  const [student, setStudent] = useState({
    ten: "",
    thanhPho: "",
    xepLoai: "GIOI",
    ngaySinh: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const limit = 5;
  const { totalPages, students, status, message, error } = useSelector((state) => state.student);
  const dispatch = useDispatch();

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handle_delete = (id) => {
    dispatch(deleteStudent(id)).then(() => {
      // Refresh the list after deleting
      dispatch(getAll({ currentPage, limit }));
    });
  };

  useEffect(() => {
    dispatch(getAll({ currentPage, limit }));
  }, [currentPage, dispatch]);

  useEffect(()=>{
    if (status && message){
        setShowMessage(true);

        const timer = setTimeout(()=>{
            setShowMessage(false)
            dispatch(resetStatusAndMessage())
        }, 2000)

        return () => clearTimeout(timer);
    }
  },[status, message, dispatch])

  const handle_add = () => {
    dispatch(addNewStudent(student)).then(() => {
      // Refresh the list after deleting
      dispatch(getAll({ currentPage, limit }));
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name + value);
    if (name === "ngaySinh") {
      setStudent((prevStudent) => ({
        ...prevStudent,
        [name]: convertDateToDDMMYYYY(value),
      }));
    } else {
      setStudent((prevStudent) => ({
        ...prevStudent,
        [name]: value,
      }));
    }
  };

  const convertDateToYYYYMMDD = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const convertDateToDDMMYYYY = (date) => {
    console.log(date);
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(()=>{
    if (status){
        if (status == 200){
            toast.success(message);
            setModal(false); // Close modal if success
        }
        else {
            toast.error(message);
        }
    }
  }, [status, message]);

  return (
    <div className="students">
      <Container>
        <h1>Total: {totalPages}</h1>
        <Button color="success" onClick={toggle}>
          Add new student
        </Button>
        <Modal isOpen={modal} toggle={toggle}>
            {
                error && (
                    <Alert color="danger">
                        <ul>
                            {
                                error.map((e, index) => (
                                    <li key={index}>{e}</li>
                                ))
                            }
                        </ul>
                    </Alert>
                )
            }
          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="exampleName">Họ tên</Label>
              <Input
                id="exampleName"
                name="ten"
                placeholder="Nhập họ tên"
                value={student.ten}
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleCity">Thành phố</Label>
              <Input
                id="exampleCity"
                name="thanhPho"
                placeholder="Nhập thành phố"
                value={student.thanhPho}
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="exampleRanking">Xếp loại</Label>
              <Input
                id="exampleSelect"
                name="xepLoai"
                type="select"
                onChange={handleChange}
              >
                <option value="GIOI" selected={true}>Giỏi</option>
                <option value="KHA">Khá</option>
                <option value="TRUNG_BINH">Trung bình</option>
                <option value="YEU">Yếu</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="exampleBirthday">Ngày sinh</Label>
              <Input
                id="exampleBirthday"
                name="ngaySinh"
                placeholder="Birthday field"
                type="date"
                value={student.ngaySinh}
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handle_add}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {
            showMessage && (
                <Alert color={status == 200? "success" : "danger"}>
                    {message}
                </Alert>
            )
        }
        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sinh viên</th>
              <th>Thành phố</th>
              <th>Ngày sinh</th>
              <th>Xếp loại</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td scope="row">{item.ten}</td>
                  <td>{item.thanhPho}</td>
                  <td>{item.ngaySinh}</td>
                  <td>{item.xepLoai}</td>
                  <td>
                    <Button
                      className="btn btn-danger"
                      onClick={() => {
                        if (
                          window.confirm("Bạn có muốn xóa student hay không?")
                        ) {
                          handle_delete(item.id);
                        }
                      }}
                    >
                      <i class="fa-solid fa-delete-left"></i>
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(totalPages)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </Container>
    </div>
  );
}
