import React, { Component } from "react"
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"
import Room from "./Room"
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import axios from "axios"

export default class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomCode: null,
        }
    }

    componentDidMount = async () => {
        try{
            const response = await axios.get("/api/user-in-room/")
            const data = response.data
            this.setState({
                roomCode: data.roomCode
            })
        } catch (error) {
            console.warn(error)
        }
    }

    renderHomePage = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup variant="contained" color="primary">
                        <Button color="primary" to="/join" component={ Link }>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={ Link }>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }

    render = () => {
        return (<Router>
            <Switch>
                <Route exact path='/' render={ () => {
                    return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`}/>) : this.renderHomePage()
                } } />
                <Route path='/join/' component={RoomJoinPage} />
                <Route path='/create/' component={CreateRoomPage} />
                <Route path='/room/:roomCode' component={Room} />
            </Switch>
        </Router>)
    }
}

