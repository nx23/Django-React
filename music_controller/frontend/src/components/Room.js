import React, { Component } from "react"
import axios from "../utils/axios"
import { Button, Grid, Typography } from "@material-ui/core"
import CreateRoomPage from "./CreateRoomPage"

export default class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            show_settings: false,
        }
        this.roomCode = this.props.match.params.roomCode
        this.leaveRoomButtonPressed = this.leaveRoomButtonPressed.bind(this)
        this.updateShowSettings = this.updateShowSettings.bind(this)
        this.renderSettingsButton = this.renderSettingsButton.bind(this)
        this.renderSettings = this.renderSettings.bind(this)
        this.getRoomDetails()
    }

    updateShowSettings = (value) => {
        this.setState({
            show_settings: value,
        })
    }

    renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    renderSettings = () => {
        return <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage
                update={true}
                votesToSkip={this.state.votesToSkip}
                guestCanPause={this.guestCanPause}
                roomCode={this.roomCode}
                updateCallback= { this.getRoomDetails }>
                </CreateRoomPage>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={() => this.updateShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
    }

    getRoomDetails = async () => {
        try {
            const response = await axios.get(`/api/get-room?code=${this.roomCode}`)
            const data = response.data
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
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
            this.props.leaveRoomCallback()
            this.props.history.push("/")
        } catch (error) {
            console.warn(error)
        }
    }

    render = () => {
        if (this.state.show_settings) {
            return this.renderSettings()
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guest Can Pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={ this.leaveRoomButtonPressed }>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        )
    }
}
