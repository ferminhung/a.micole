
import React from "react";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,
  Label,
  FormGroup,
  Input,
  Alert,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
  Form,
} from "reactstrap";
import ReactBSAlert from "react-bootstrap-sweetalert";
import ReactDatetime from "react-datetime";
import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";
import Select from "react-select";
import * as mainActions from "../actions/mainActions";
import { connect } from 'react-redux';
class Mensajes extends React.Component {
  constructor() {
    super();
    this.state = {
      singleSelect: null,
      subiendo: null,
      seccion:"*",
      titulo:null,
      fecha:null,
      Grado:[],
      Seccion:[],
      Primaria:[],
      Secundaria:[],
      modulos:[],
      itemscurriculo:[],
      curriculo:null,
      acepta:"*",
      parabuscar:null,
      subirRecurso:null,
      mensaje:null,
      mensajes:[],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
  }
  handleClick(e) {
    this.refs.fileInput.click();
  }
  handleRemove() {
    this.setState({
      file: null,
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage,
    });
    this.refs.fileInput.value = null;
  }
  setGrado = (value) => {
    this.setState({ singleSelect: value })
    if(value.value>6){
      this.setState({materias:this.props.Secundaria})
    }else{
      this.setState({materias:this.props.Primaria})
    }
  }
  setSeccion = (value) => {
    this.setState({ seccion: value })
    console.log(value)
  }

  componentDidMount = async () => {
    this.props.verCredenciales();
    if(!this.props.colegio.id){
      this.props.history.push("/auth/login");
    }
    await this.verMensaje(this.props.colegio.codigo,"*");
  }

  verMensaje = async (codigo) => {
    let url='https://webhooks.mongodb-realm.com/api/client/v2.0/app/aprendemicolegio-kmnsj/service/micolegio/incoming_webhook/leerMensajes?codigo='+codigo;
    let respuesta = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers:{
            'Content-Type': 'application/json'
        },
        Accept: 'application/json',
    }).catch(error => {
        console.log(error);
    });
    let mensajes = await respuesta.json();
    this.setState({ mensajes:mensajes});
    console.log(mensajes)
    console.log(codigo)
  }

  enviarMensaje = async () =>{
    const data = {
      plantel:this.props.colegio.codigo,
      grado: this.state.singleSelect,
      seccion:this.state.seccion.value,
      fecha: this.state.fecha,
      mensaje:this.state.mensaje,
    };
    let url='https://webhooks.mongodb-realm.com/api/client/v2.0/app/aprendemicolegio-kmnsj/service/masterside/incoming_webhook/registrarMensaje';
    let respuesta = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      },
      Accept: 'application/json',
    })
    .catch(error => {
        console.log(error);
    });
    this.setState({
      // seccion:null,
      singleSelect:null,
    });
    await this.verMensaje(this.props.colegio.codigo);
    let result = await respuesta.json(data);
    console.log(result)
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="6" lg="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Registro de Mensajes</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="form-horizontal" >
                    <Row>
                      <Label md="3">Grado o año</Label>
                      <Col md="6">
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={this.state.singleSelect}
                          onChange={(value) =>
                            this.setGrado(value )
                          }
                          options={this.props.Grado}
                          placeholder="Seleccion el Grado o año"
                        />
                      </Col>
                      <Col md="3">
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="seccion"
                          value={this.state.seccion.value}
                          onChange={(value) =>
                            this.setSeccion(value)
                          }
                          options={this.props.Seccion}
                          placeholder="Seccion"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Label md="3">Contenido del Mensaje</Label>
                      <Col md="9">
                        <FormGroup>
                          <Input placeholder="Asunto del mensaje"
                            type="text"
                            value={this.state.mensaje}
                            onChange={(texto) =>
                              this.setState({ mensaje:texto.target.value })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Label md="3">Vencimiento</Label>
                      <Col md="6">
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "Date Picker Here",
                          }}
                          timeFormat={false}
                          value={this.state.fecha}
                          onChange={(value) =>
                            this.setState({ fecha: value })
                          }
                        />
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  {this.state.mensaje ? (
                    <Row>
                      <Col md="3" />
                      <Col md="9">
                        <Button className="btn-round"
                        color="info" type="button"
                        onClick={()=>this.enviarMensaje()}
                      >
                          Registrar mensaje
                        </Button>
                      </Col>
                    </Row>
                    ):(null)}
                  </CardFooter>
              </Card>
            </Col>
            <Col md="6" lg="6">
                <Card className="card-tasks">
                  <CardHeader>
                    <Row>
                      <Col md="12">
                        <CardTitle tag="h4">
                          Mensajes Enviados
                        </CardTitle>
                      </Col>
                      <Col md="6">
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={this.state.parabuscar}
                          onChange={(value) =>
                            this.verMensaje(this.props.colegio.codigo,value.key)
                          }
                          options={this.props.Grado}
                          placeholder="Seleccion el Grado o año"
                        />
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="table-full-width table-responsive">
                      <Table>
                        <tbody>
                          {this.state.mensajes.map(mensaje=>(
                              <tr>
                                <td >
                                  <div className="timeline-badge danger">
                                    <i className="nc-icon nc-single-copy-04" />
                                  </div>
                                </td>
                                <td className="text-left">
                                  {mensaje.grado.label} {mensaje.seccion}
                                </td>
                                <td className="text-left">
                                  {mensaje.mensaje}
                                </td>
                                <td className="text-left">
                                  {mensaje.fecha} ({mensaje.hora})
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div className="stats">
                      <i className="fa fa-refresh spin" />
                      Updated 3 minutes ago
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            {/* <Col md="6" lg="6">
              <Card>
                <CardHeader>
                  <CardText tag="div">
                    <CardTitle tag="h4">Mensajes Enviados</CardTitle>
                  </CardText>
                </CardHeader>
                <CardBody className="table-responsive">
                  <Table className="table-hover">
                    <thead className="text-warning">
                      <tr>
                        <th>#</th>
                        <th>Grado</th>
                        <th>Asunto</th>
                        <th>Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = (reducers) => {
  return reducers.mainReducer;
}

export default connect(mapStateToProps, mainActions )(Mensajes);
