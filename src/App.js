import React, {Component} from 'react';
import {Container,Table,Button,Form} from 'react-bootstrap';
import axios from 'axios';

class App extends Component {
  constructor() {
    super()
    this.state = {
      dataApi: [],
      statusEdit: false,
      dataPost: {
        id: null,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: ""
      }
    }
    this.refreshData = this.refreshData.bind(this);
    this.btnHapus = this.btnHapus.bind(this);
    this.btnSubmit = this.btnSubmit.bind(this);
    this.eventChange = this.eventChange.bind(this);
    this.hapusPost = this.hapusPost.bind(this);
    this.btnEdit = this.btnEdit.bind(this);
  }

  refreshData() {
    axios.get("http://localhost:3001/data-karyawan")
    .then((json)=>{
      this.setState({
        dataApi: json.data
      })
      // console.log(json.data)
    })
  }

  hapusPost() {
    let newDataPost = {...this.state.dataPost};
    newDataPost["id"] = null;
    newDataPost["nama_karyawan"] = "";
    newDataPost["jabatan"] = "";
    newDataPost["jenis_kelamin"] = "";
    newDataPost["tanggal_lahir"] = "";

    this.setState({
      dataPost: newDataPost
    })
  }

  btnEdit(e) {
    axios.get(`http://localhost:3001/data-karyawan/${e.target.value}`)
    .then((json)=>{
      this.setState({
        dataPost: json.data,
        statusEdit: true
      })
    })
  }

  btnHapus(e) {
    axios.delete(`http://localhost:3001/data-karyawan/${e.target.value}`)
    .then(()=>{
      this.refreshData()
    })
  }

  btnSubmit(e) {
    if (this.state.statusEdit === false) {
      if (this.state.dataPost.nama_karyawan === "" && this.state.dataPost.jabatan === "" && this.state.dataPost.jenis_kelamin === "" && this.state.dataPost.tanggal_lahir === "") {
        alert("Form Harap Diisi")
      } else {
        axios.post('http://localhost:3001/data-karyawan', this.state.dataPost)
        .then((json)=>{
          this.refreshData();
          this.hapusPost();
        })
      }
      e.prevent.default()
    } else {
      axios.put(`http://localhost:3001/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost)
      .then(()=>{
        this.setState({
          statusEdit: false
        })
      })
    }
    this.refreshData();
    this.hapusPost();
  }

  eventChange(e) {
    let newDataPost = {...this.state.dataPost};
    if (this.state.statusEdit === false) {
      newDataPost["id"] = new Date().getTime();
    }
    newDataPost[e.target.name] = e.target.value;
    this.setState({
      dataPost: newDataPost
    })
  }

  componentDidMount() {
    this.refreshData()
  }

  render() {
    return(
      <Container>
        <h1 className="text-center mt-3">DATA KARYAWAN</h1>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>NAMA KARYAWAN</Form.Label>
              <Form.Control type="text" name="nama_karyawan" value={this.state.dataPost.nama_karyawan} placeholder="Ketik Nama" onChange={this.eventChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>JABATAN</Form.Label>
              <Form.Control type="text" name="jabatan" value={this.state.dataPost.jabatan} placeholder="Ketik Jabatan" onChange={this.eventChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control as="select" aria-label="Default select example" name="jenis_kelamin" size="sm" onChange={this.eventChange}>
                <option>--PILIH JENIS KELAMIN--</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>TANGGAL & TAHUN LAHIR</Form.Label>
              <Form.Control type="date" name="tanggal_lahir" value={this.state.dataPost.tanggal_lahir} onChange={this.eventChange}/>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={this.btnSubmit}>
              Submit
            </Button>
          </Form>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr style={{textAlign: "center"}}>
                <th>NO</th>
                <th>ID PEGAWAI</th>
                <th>NAMA PEGAWAI</th>
                <th>JABATAN</th>
                <th>JENIS KELAMIN</th>
                <th>TANGGAL LAHIR</th>
                <th>PILIHAN</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataApi.map((value,index)=>{
                return(
                  <tr key={index}>
                    <td style={{textAlign: "center"}}>{index+1}</td>
                    <td style={{textAlign: "center"}}>{value.id}</td>
                    <td style={{textTransform: "capitalize"}}>{value.nama_karyawan}</td>
                    <td style={{textAlign: "center"}}>{value.jabatan}</td>
                    <td style={{textAlign: "center", textTransform: "capitalize"}}>{value.jenis_kelamin}</td>
                    <td style={{textAlign: "center"}}>{value.tanggal_lahir}</td>
                    <td style={{textAlign: "center"}}>
                      <Button variant="danger" value={value.id} onClick={this.btnHapus}>Hapus</Button>
                      <Button variant="secondary" value={value.id} onClick={this.btnEdit}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

      </Container>
    );
  }
}

export default App;
