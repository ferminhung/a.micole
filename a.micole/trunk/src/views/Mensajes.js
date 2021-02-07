
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
import { uploadFile } from 'react-s3';

class Mensajes extends React.Component {
  constructor() {
    super();
    this.state = {
      singleSelect: null,
      tareas: [],
      subiendo: null,
      materias:null,
      seccion:null,
      asignatura:null,
      file: null,
      imagePreviewUrl: defaultImage,
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
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleImageChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    if(file.size<5000000){
      let doc = new FileReader();
      doc.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: doc.result,
        });
      };
      doc.readAsDataURL(file);
    }else{
      let subiendo = (
        <Alert color="info">
          <span>Recurso invalido</span>
        </Alert>
      );
      this.setState({subirRecurso:false, mensaje:null,
        file:null, imagePreviewUrl:null, subiendo:subiendo,
      });
      alert("Solo se aceptan documentos menores a 5mb ");
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.state.file is the file/image uploaded
    // in this function you can save the image (this.state.file) on form submit
    // you have to call it yourself
  }
  handleClick() {
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
  }

  setModulos = (value)  => {
    this.setState({ modulo: value })
  }

  verTareas = async (id,grado) => {
    /* let url='https://webhooks.mongodb-realm.com/api/client/v2.0/app/aprendemicolegio-kmnsj/service/masterside/incoming_webhook/verRecursos?id='
      +id+"&grado="+grado;
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
    let tareas = await respuesta.json();
    this.setState({ tareas:tareas}); */
  }

  async verModulos(){
    let url='https://webhooks.mongodb-realm.com/api/client/v2.0/app/aprendemicolegio-kmnsj/service/masterside/incoming_webhook/vermodulos';
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
    let modulos = await respuesta.json();
    
    this.setState({ modulos:modulos});
  }

 

  componentDidMount = async () => {
    this.props.verCredenciales();
    if(!this.props.colegio.id){
      this.props.history.push("/auth/login");
    }
    await this.verTareas(this.props.colegio.id,"*");
  }

  quitarTarea = async (id) => {
    const datadir = {
      codigo:id,
    };
    let url='https://webhooks.mongodb-realm.com/api/client/v2.0/app/aprendemicolegio-kmnsj/service/masterside/incoming_webhook/quitarRecurso';
    fetch(url, {
        method: 'POST', 
        body: JSON.stringify(datadir),
        headers:{
            'Content-Type': 'application/json'
        },
        Accept: 'application/json',
    })
    .then(async resp  => {
        await this.verTareas(this.props.colegio.id);
    })
    .catch(error => {
        console.log(error);
    });
  }

  ponerModal = () => {
    const inputValue = this.state.alert;
    this.setState({
      modal: (
        <ReactBSAlert
        custom
        showCancel
        showCloseButton
        confirmBtnText="Modificar"
        cancelBtnText="Salir"
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="light"
        customIcon="https://raw.githubusercontent.com/djorg83/react-bootstrap-sweetalert/master/demo/assets/thumbs-up.jpg"
        title="Cambios en la Actividad?"
        onConfirm={this.onConfirm}
        onCancel={()=>this.setState({modal:null})}
          >
          <Form className="form-horizontal">
            <Row>
              <Label md="3">Vencimiento</Label>
                <Col md="6">
                  <ReactDatetime
                    inputProps={{
                      className: "form-control",
                      placeholder: "dd-mm-aaaa",
                    }}
                    timeFormat={false}
                    value={this.state.fecha}
                    onChange={(value) =>
                      this.setState({ fecha: value })
                    }
                  />
                </Col>
              </Row>
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
                    value={this.state.seccion}
                    onChange={(value) =>
                      this.setSeccion(value )
                    }
                    options={this.props.Seccion}
                    placeholder="Seccion"
                  />
                  </Col>
              </Row>
              <Row>
                <Label md="3">Titulo tarea</Label>
                <Col md="9">
                  <FormGroup>
                    <Input placeholder="Nombre descriptivo de la tarea"
                      type="text" 
                      value={this.state.titulo}
                      onChange={(texto) =>
                          this.setState({ titulo:texto.target.value })
                        }
                      />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Label md="3">Asignatura</Label>
                <Col md="9">
                  <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="singleSelect"
                    value={this.state.asignatura}
                    onChange={(value) =>
                      this.setState({ asignatura: value })
                    }
                    options={this.state.materias}
                    placeholder="Selecciona el Area o Asignatura"
                  />
                </Col>
              </Row>
              <Row>
                <Label md="3">Item Curriculo</Label>
                <Col md="9">
                  <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="singleSelect"
                    value={this.state.curriculo}
                    onChange={(value) =>
                      this.setState({ curriculo: value })
                    }
                    options={this.state.itemscurriculo}
                    placeholder="Selecciona el Item o Bloque"
                  />
                </Col>
              </Row>
            </Form>
            <Row>.</Row>
            <Row>.</Row>
            <Row>.</Row>
            <Row>.</Row>
        </ReactBSAlert>
          
       
      ),
    });
  }

  filtrar=(grado)=>{
    alert(grado);
  }
  
  render() {
    return (
      <>
        <div className="content">
          <Row>
          {this.state.modal}
          <Col md="6" lg="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Registro de Mensajes</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="form-horizontal">
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
                          value={this.state.seccion}
                          onChange={(value) =>
                            this.setSeccion(value )
                          }
                          options={this.props.Seccion}
                          placeholder="Seccion"
                        />
                        </Col>
                    </Row>
                    <Row>
                      <Label md="3">Titulo del Mensaje</Label>
                      <Col md="9">
                        <FormGroup>
                          <Input placeholder="Asunto del mensaje"
                            type="text" 
                            value={this.state.titulo}
                            onChange={(texto) =>
                                this.setState({ titulo:texto.target.value })
                              }
                           />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Label md="3">Contenido del Mensaje</Label>
                      <Col md="9">
                        <FormGroup>
                          <Input 
                            type="text" 
                            value={this.state.titulo}
                            onChange={(texto) =>
                                this.setState({ titulo:texto.target.value })
                              }
                           />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Row>
                    <Col md="9">
                      <Button className="btn-round" 
                      color="info" type="submit"
                      onClick={()=>this.uploadFile()}
                    >
                        Registrar Mensaje 
                      </Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
            <Col md="6" lg="6">
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
            </Col>
          </Row>
          <Row>
            <Col className="text-center" lg="6" md="6">
              <Row>
              <Col className="text-center" lg="12" md="12">  
              <Card className="card-tasks">
                <CardHeader>
                  <Row>
                  <Col md="6">
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
                        this.verTareas(this.props.colegio.id,value.key)
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
                        {this.state.tareas.map(tarea=>( 
                          <tr>
                            <td >
                              <div className="timeline-badge danger">
                                <i className="nc-icon nc-single-copy-04" />
                              </div>
                            </td>
                            <td className="text-left">
                              {tarea.grado} {tarea.seccion}
                            </td>
                            <td className="text-left">
                              {tarea.materia} {tarea.titulo}
                            </td>
                            <td className="text-left">
                              {tarea.fecha} ({tarea.hora})
                            </td>
                            <td className="td-actions text-right">
                              <Button
                                className="btn-round btn-icon btn-icon-mini btn-neutral"
                                color="info"
                                title=""
                                type="button"
                                onClick={()=>this.ponerModal(tarea._id)}
                              >
                                <i className="nc-icon nc-ruler-pencil" />
                              </Button>
                             
                              <Button
                                className="btn-round btn-icon btn-icon-mini btn-neutral"
                                color="danger"
                                title=""
                                type="button"
                                onClick={()=>this.quitarTarea(tarea._id)}
                              >
                                <i className="nc-icon nc-simple-remove" />
                              </Button>
                              
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
            
            </Row>
            </Col>
            <Col md="6">
              <Card className="card-timeline card-plain">
                <CardBody>
                  <ul className="timeline timeline-simple">
                  {this.state.tareas.map(tarea=>( 
                    <li className="timeline-inverted">
                      <div className="timeline-badge danger">
                        <i className="nc-icon nc-single-copy-04" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <Badge color="danger" pill>
                            {tarea.materia}
                          </Badge>
                        </div>
                        <div className="timeline-body">
                          <p>
                            {tarea.grado} {tarea.seccion}
                          </p>
                        </div>
                        <h6>
                          <i className="ti-time" />
                          {tarea.fecha} / {tarea.hora} 
                        </h6>
                      </div>
                    </li>
                  ))}
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            
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
