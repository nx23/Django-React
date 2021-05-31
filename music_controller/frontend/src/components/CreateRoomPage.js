import React, { Component } from "react"
import axios from "../utils/axios"
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Collapse } from "@material-ui/core"
import { Link, useHistory } from "react-router-dom"
import { Alert } from "@material-ui/lab"

export default class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip: 2,
        update: false,
        guestCanPause: false,
        roomCode: null,
        updateCallback: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            msg: "",
        }
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this)
        this.handleVotesChange = this.handleVotesChange.bind(this)
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this)
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this)
    }
    
    renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={ this.handleRoomButtonPressed }>
                    Create a Room
                </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={ Link }>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    }

    renderUpdateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={ this.handleUpdateButtonPressed }>
                    Update Room
                </Button>
                </Grid>
            </Grid>
        )
    }

    handleVotesChange = (e) => {
        this.setState({
            votesToSkip: e.target.value,
        })
    }
    
    handleGuestCanPauseChange = (e) => {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        })
    }

    handleRoomButtonPressed = async () => {
        try {
            const room = {
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }
            const response = await axios.post("/api/create-room/", room)
            const data = response.data
            this.props.history.push(`/room/${data.code}`)
        } catch (error) {
            console.warn(error)
        }
    }

    handleUpdateButtonPressed = async () => {
        try {
            const room = {
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            }
            const response = await axios.patch("/api/update-room/", room)
            const data = response.data
            if (response.status) {
                this.setState({
                    msg: "Room updated successfully!",
                })
                this.props.updateCallback()
            } else {
                this.setState({
                    msg: "Something went wrong..."
                })
            }
        } catch (error) {
            this.setState({
                msg: "Something went wrong..."
            })
            console.warn(error)
        }
    }

    render = () => {
        const title = this.props.update ? "Update Room" : "Create a Room"
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse in={ this.state.msg != "" }>
                        {this.state.msg != "" ? (
                        <Alert
                            severity="success"
                            onClose={() => {
                            this.setState({ msg: "" });
                            }}
                        >
                            {this.state.msg}
                        </Alert>
                        ) : (
                        <Alert
                            severity="error"
                            onClose={() => {
                            this.setState({ msg: "" });
                            }}
                        >
                            {this.state.msg}
                        </Alert>
                        )}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        { title }
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Control of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup
                        row
                        defaultValue={this.props.guestCanPause.toString()}
                        onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary"/>}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="secondary"/>}
                                label="No Control"
                                labelPlacement="bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            type="number"
                            onChange={this.handleVotesChange}
                            defaultValue={this.props.votesToSkip}
                            inputProps={{
                                min: 1,
                                style: { textAlign:"center" },
                            }}
                        />
                        <FormHelperText>
                            <div align="center">
                                Votes Required To Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                { this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons() }
            </Grid>
        )
    }
}

