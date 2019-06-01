import React, { Component } from 'react';
//import { constants } from '../../common/utils';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
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

const styles = theme => ({
    userAvatar: {
        margin: 20,
        width: 50,
        height: 50,
    }
});


const USERS_API = 'https://api.instagram.com/v1/users/self/?access_token=';
const USER_MEDIA_API = 'https://api.instagram.com/v1/users/self/media/recent?access_token=';


class Profile extends Component {

    constructor(props) {

    super(props);
    if (sessionStorage.getItem('access-token') === null)
        props.history.replace('/'); 

        this.state = {
        userName: "",
        fullName: "",
        profilePicture: "",
        posts: 0,
        follows: 0,
        followed_by: 0,
        //access_token: sessionStorage.getItem('access-token'),
        accessToken: '8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784',
        
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

    render() {

    const { classes } = this.props;
    return (
        <div className="main-container">
            <Header screen={"Profile"} userProfileUrl={this.state.profilePicture} handleLogout={this.logout} />
            <div className="information-section">
                <Avatar
                    alt="User Image"
                    src={this.state.profilePicture}
                    style={{ width: "50px", height: "50px" }}
                />
            </div> 
        </div> 
           )
        }    
}

export default withStyles(styles)(Profile);