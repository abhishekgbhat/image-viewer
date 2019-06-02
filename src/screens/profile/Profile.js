import React, { Component } from 'react';

import { constants } from '../../common/utils';
import Header from '../../common/header/Header';
import './Profile.css';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
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
        paddingTop: '50%', // 16:9
    },

    userIcon:
    {
        width: "50px",
        height: "50px",
        margin: "20px"
    },

    imageModal:
    {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: "10px",
       
        
    }

};



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
            access_token: sessionStorage.getItem('access-token'),
            //accessToken: '8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784',
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

    //User Info API data fetch
    getUserInfo = () => {

        let url = `${constants.userInfoUrl}/?access_token=${sessionStorage.getItem('access-token')}`;
        return fetch(url, {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            this.setState({
                userName: jsonResponse.data.username,
                fullName: jsonResponse.data.full_name,
                profilePicture: jsonResponse.data.profile_picture,
                posts: jsonResponse.data.counts.media,
                follows: jsonResponse.data.counts.follows,
                followed_by: jsonResponse.data.counts.followed_by
            });
        }).catch((error) => {
            console.log('error user data', error);
        });
    }

    //Media posts data fetch
    getMediaData = () => {

        let url = `${constants.userMediaUrl}/?access_token=${sessionStorage.getItem('access-token')}`;
        return fetch(url, {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            this.setState({
                mediaData: jsonResponse.data
            });
        }).catch((error) => {
            console.log('error media data', error);
        });
    }

    //Information-section modal handlers
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

    //Image-posts modal handlers
    handleOpenImageModal = (event) => {
        var result = this.state.mediaData.find(item => {
            return item.id === event.target.id
        })
        console.log(result);
        this.setState({ imageModalOpen: true, currentItem: result });
    }

    handleCloseImageModal = () => {
        this.setState({ imageModalOpen: false });
    }

    likeClickHandler = (id) => {
        console.log('like id', id);
        var foundItem = this.state.currentItem;

        if (typeof foundItem !== undefined) {
            if (!this.state.likeSet.has(id)) {
                foundItem.likes.count++;
                this.setState(({ likeSet }) => ({
                    likeSet: new Set(likeSet.add(id))
                }))
            } else {
                foundItem.likes.count--;
                this.setState(({ likeSet }) => {
                    const newLike = new Set(likeSet);
                    newLike.delete(id);

                    return {
                        likeSet: newLike
                    };
                });
            }
        }
    }

    onAddCommentClicked = (id) => {
        console.log('id', id);
        if (this.state.currentComment === "" || typeof this.state.currentComment === undefined) {
            return;
        }

        let commentList = this.state.comments.hasOwnProperty(id) ?
            this.state.comments[id].concat(this.state.currentComment) : [].concat(this.state.currentComment);

        this.setState({
            comments: {
                ...this.state.comments,
                [id]: commentList
            },
            currentComment: ''
        })
    }

    commentChangeHandler = (e) => {
        this.setState({
            currentComment: e.target.value
        });
    }

    render() {

        let hashTags = []
        if (this.state.currentItem !== null) {
            hashTags = this.state.currentItem.tags.map(hash => {
                return "#" + hash;
            });
            console.log('state', this.state);
        }

        return (
            <div className="main-container">
                <Header profileIcon={true} profilePicture={this.state.profilePicture} />
                <div className="information-section">
                    <Avatar
                        alt="User Image"
                        src={this.state.profilePicture}
                        style={styles.userIcon}
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
                                 </SvgIcon>
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
                <div className="media-posts-grid">
                    {this.state.mediaData != null &&
                        <GridList cellHeight={'auto'} cols={3} style={{ padding: "40px" }}>
                            {this.state.mediaData.map(item => (
                                <GridListTile key={item.id}>
                                    <CardMedia
                                        id={item.id}
                                        style={styles.media}
                                        image={item.images.standard_resolution.url}
                                        title={item.caption.text}
                                        onClick={this.handleOpenImageModal}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>}
                
                    {this.state.currentItem != null &&
                        <Modal
                            aria-labelledby="image-modal"
                            aria-describedby="modal to show image details"
                            open={this.state.imageModalOpen}
                            onClose={this.handleCloseImageModal}
                            style={styles.imageModal}>
                        <div className="image-posts-information" >
                            <div className="image-modal-left">
                                <img style={{ height: '100%', width: '100%' }}
                                    src={this.state.currentItem.images.standard_resolution.url}
                                    alt={this.state.currentItem.caption.text} />
                            </div>
                            <div className="image-modal-right">
                                <div className="image-modal-rightTop">
                                    <Avatar alt="User Image" src={this.state.profilePicture} style={styles.userIcon} />
                                    <Typography component="p">
                                        {this.state.userName}
                                    </Typography>                                                                        
                                </div> 
                                <div style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography component="p">
                                        {this.state.currentItem.caption.text}
                                    </Typography>
                                    <Typography style={{ color: '#4dabf5' }} component="p" >
                                        {hashTags.join(' ')}
                                    </Typography>
                                    <br />    
                                    <div className="comment">
                                    {this.state.comments.hasOwnProperty(this.state.currentItem.id) && this.state.comments[this.state.currentItem.id].map((comment, index) => {
                                            return (
                                                <div key={index} className="row">
                                                    <Typography component="p" style={{ fontWeight: 'bold' }}>
                                                        {this.state.userName}:
                                                    </Typography>
                                            
                                                    <Typography component="p" >
                                                        {comment}
                                                    </Typography>
                                                </div>
                                               
                                            )
                                    })}
                                     </div>
                                 </div>
                                    <div>
                                        <div className="row">
                                            <IconButton aria-label="Add to favorites" onClick={this.likeClickHandler.bind(this, this.state.currentItem.id)}>
                                                {this.state.likeSet.has(this.state.currentItem.id) && <FavoriteIconFill style={{ color: '#F44336' }} />}
                                                {!this.state.likeSet.has(this.state.currentItem.id) && <FavoriteIconBorder />}
                                            </IconButton>
                                            <Typography component="p">
                                                {this.state.currentItem.likes.count} Likes
                                            </Typography>
                                        </div>
                                        <div className="row">
                                            <FormControl style={{ flexGrow: 1, paddingBottom:'10px' }}>
                                                <InputLabel htmlFor="comment">Add Comment</InputLabel>
                                                <Input id="comment" value={this.state.currentComment} onChange={this.commentChangeHandler} />
                                            </FormControl>
                                            <FormControl>
                                                <Button onClick={this.onAddCommentClicked.bind(this, this.state.currentItem.id)}
                                                    variant="contained" color="primary">
                                                    ADD
                                                </Button>
                                            </FormControl>
                                        </div>
                                    </div>

                                </div>
                            </div>
                                
                        </div> 
                        </Modal>}
                </div>
            </div>
        )
    }
}

export default Profile;
