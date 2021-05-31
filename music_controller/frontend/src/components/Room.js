import React, { Component } from "react"
import axios from "../utils/axios"
import { Button, Grid, Typography } from "@material-ui/core"

export default class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            votes_to_skip: 2,
            guest_can_pause: false,
            is_host: false,
        }
        this.roomCode = this.props.match.params.roomCode
        this.getRoomDetails()
        this.leaveRoomButtonPressed = this.leaveRoomButtonPressed.bind(this)
    }

    getRoomDetails = async () => {
        try {
            const response = await axios.get(`/api/get-room?code=${this.roomCode}`)
            const data = response.data
            this.setState({
                votes_to_skip: data.votes_to_skip,
                guest_can_pause: data.guest_can_pause,
                is_host: data.is_host,
            })
        } catch (error) {
            this.props.history.push("/")
            console.warn(error)
        }
    }

    leaveRoomButtonPressed = async () => {
        try {
            const room = { }
            const response = await axios.post("/api/leave-room/", room)
            this.props.history.push("/")
        } catch (error) {
            console.warn(error)
        }
    }

    render = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {this.state.votes_to_skip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guest Can Pause: {this.state.guest_can_pause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {this.state.is_host.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={ this.leaveRoomButtonPressed }>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        )
    }
}
