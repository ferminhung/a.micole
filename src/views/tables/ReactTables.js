
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import * as mainActions from "../../actions/mainActions";
import { connect } from 'react-redux';
// core components
import ReactTable from "components/ReactTable/ReactTable.js";

class ReactTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    await this.ir();
  }

  ir = async ()=>{
    let table = this.props.alumnos.map((prop, key) => {
      return {
        id: prop._id,
        nombre: prop.nombre,
        apellido: prop.apellido,
        grado: prop.grado,
        codigo: prop.codigo,
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            {/* use this button to add a like kind of action */}
            <Button
              onClick={() => {
                let obj = this.state.data.find((o) => o.id === key);
                alert(
                  "You've clicked LIKE button on \n{ \nName: " +
                    obj.name +
                    ", \nposition: " +
                    obj.position +
                    ", \noffice: " +
                    obj.office +
                    ", \nage: " +
                    obj.age +
                    "\n}."
                );
              }}
              color="info"
              size="sm"
              className="btn-icon btn-link like"
            >
              <i className="fa fa-heart" />
            </Button>{" "}
            {/* use this button to add a edit kind of action */}
            <Button
              onClick={() => {
                let obj = this.state.data.find((o) => o.id === key);
                alert(
                  "You've clicked EDIT button on \n{ \nName: " +
                    obj.name +
                    ", \nposition: " +
                    obj.position +
                    ", \noffice: " +
                    obj.office +
                    ", \nage: " +
                    obj.age +
                    "\n}."
                );
              }}
              color="warning"
              size="sm"
              className="btn-icon btn-link edit"
            >
              <i className="fa fa-edit" />
            </Button>{" "}
            {/* use this button to remove the data row */}
            <Button
              onClick={() => {
                var data = this.state.data;
                data.find((o, i) => {
                  if (o.id === key) {
                    // here you should add some custom code so you can delete the data
                    // from this component and from your server as well
                    data.splice(i, 1);
                    console.log(data);
                    return true;
                  }
                  return false;
                });
                this.setState({ data: data });
              }}
              color="danger"
              size="sm"
              className="btn-icon btn-link remove"
            >
              <i className="fa fa-times" />
            </Button>{" "}
          </div>
        ),
      };
    });
    this.setState({data:table});
    
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Alumnos</CardTitle>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={this.state.data}
                    columns={[
                      
                      {
                        Header: "Nombre",
                        accessor: "nombre",
                      },
                      {
                        Header: "Apellido",
                        accessor: "apellido",
                      },
                      {
                        Header: "Grado",
                        accessor: "grado",
                      },
                      {
                        Header: "Codigo",
                        accessor: "codigo",
                      },
                      {
                        Header: "Acciones",
                        accessor: "actions",
                        sortable: false,
                        filterable: false,
                      },
                    ]}
                    /*
                      You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                    */
                    className="-striped -highlight primary-pagination"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = (reducers) => {
  return reducers.mainReducer;
}

export default connect(mapStateToProps, mainActions )(ReactTables);
