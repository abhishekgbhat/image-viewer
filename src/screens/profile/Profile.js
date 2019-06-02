import React, { Component } from 'react';
//import { constants } from '../../common/utils';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import CardMedia from '@material-ui/core/CardMedia';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIconBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIconFill from '@material-ui/icons/Favorite';
import Header from '../../common/header/Header';
import './Profile.css';

const styles = {
    paper: {
        position: 'relative',
        width: "180px",
        backgroundColor: "#fff",
        top: "30%",
        margin: "0 auto",
        boxShadow: "2px 2px #888888",
        padding: "20px"
    },
    media: {
        height: '200px',
        paddingTop: '56.25%', // 16:9
    },
    imageModal: {
        backgroundColor: "#fff",
        margin: "0 auto",
        boxShadow: "2px 2px #888888",
        padding: "10px",
    }
};


const USERS_API = 'https://api.instagram.com/v1/users/self/?access_token=';
const USER_MEDIA_API = 'https://api.instagram.com/v1/users/self/media/recent?access_token=';


class Profile extends Component {

    constructor(props) {

        super(props);

        this.state = {
            userName: "",
            fullName: "",
            profilePicture: "",
            posts: 0,
            follows: 0,
            followed_by: 0,
            //access_token: sessionStorage.getItem('access-token'),
            accessToken: '8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784',
            editOpen: false,
            fullNameRequired: 'dispNone',
            newFullName: '',
            mediaData: null,
            imageModalOpen: false,
            currentItem: null,
            likeSet: new Set(),
            comments: {},

        }
    }

    componentDidMount() {
        this.getUserInfo();
        this.getMediaData();
    }

    getUserInfo = () => {

        fetch(USERS_API + this.state.accessToken)
            .then(response => response.json())
            .then(jsonResponse => this.setState({
                userName: jsonResponse.data.username,
                fullName: jsonResponse.data.full_name,
                profilePicture: jsonResponse.data.profile_picture,
                posts: jsonResponse.data.counts.media,
                follows: jsonResponse.data.counts.follows,
                followed_by: jsonResponse.data.counts.followed_by
            }));
    }

    getMediaData = () => {

        fetch(USER_MEDIA_API + this.state.accessToken)
            .then(response => response.json())
            .then(jsonResponse => this.setState({
            }));
    }

    handleOpenEditModal = () => {
        this.setState({ editOpen: true });
    }

    handleCloseEditModal = () => {
        this.setState({ editOpen: false });
    }

    inputFullNameChangeHandler = (e) => {
        this.setState({
            newFullName: e.target.value
        })
    }

    updateClickHandler = () => {
        if (this.state.newFullName === '') {
            this.setState({ fullNameRequired: 'dispBlock' })
        } else {
            this.setState({ fullNameRequired: 'dispNone' })
        }

        if (this.state.newFullName === "") { return }

        this.setState({
            fullName: this.state.newFullName
        })

        this.handleCloseEditModal()
    }


    render() {

        
        return (
            <div className="main-container">
                <Header profileIcon={true} profilePicture={this.state.profilePicture} />
                <div className="information-section">
                    <Avatar
                        alt="User Image"
                        src={this.state.profilePicture}
                        style={{ width: "50px", height: "50px" ,margin:"20px"}}
                    />
                    <span style={{ marginLeft: "20px" }}>
                        <div style={{ width: "600px", fontSize: "big" }}> {this.state.userName} <br /> <br />
                            <div style={{ float: "left", width: "200px", fontSize: "x-small" }}> Posts: {this.state.posts} </div>
                            <div style={{ float: "left", width: "200px", fontSize: "x-small" }}> Follows: {this.state.follows} </div>
                            <div style={{ float: "left", width: "200px", fontSize: "x-small" }}> Followed By: {this.state.followed_by}</div> <br />
                        </div>
                        <div style={{ fontSize: "small" }}> {this.state.fullName}
                            <Fab size="medium" color="secondary" aria-label="Edit" style={{ marginLeft: "20px" }} onClick={this.handleOpenEditModal}>
                                <SvgIcon>
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </>
                            </Fab>
                        </div>
                        <Modal
                            aria-labelledby="edit-modal"
                            aria-describedby="modal to edit user full name"
                            open={this.state.editOpen}
                            onClose={this.handleCloseEditModal}
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                        >
                            <div style={styles.paper}>
                                <Typography variant="h5" id="modal-title">
                                    Edit
                                </Typography><br />
                                <FormControl required>
                                    <InputLabel htmlFor="fullname">Full Name</InputLabel>
                                    <Input id="fullname" onChange={this.inputFullNameChangeHandler} />
                                    <FormHelperText className={this.state.fullNameRequired}><span className="red">required</span></FormHelperText>
                                </FormControl><br /><br /><br />
                                <Button variant="contained" color="primary" onClick={this.updateClickHandler}>
                                    UPDATE
                                </Button>
                            </div>
                        </Modal>
                    </span>
                </div>
            </div>
        )
    }
}

export default Profile;