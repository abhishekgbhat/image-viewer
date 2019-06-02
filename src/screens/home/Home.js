import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import * as moment from 'moment';

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            profile_picture: '',
            username: '',
            media: 0,
            follows: 0,
            followed_by: 0,
            full_name: '',
            access_token: sessionStorage.getItem('access-token'),
            userPosts: null,
            filteredUserPosts: null
        };

    }

    componentWillMount() {

        // Get user profile
        let dataUserProfile = null;
        let xhrUserProfile = new XMLHttpRequest();
        let that = this;
        xhrUserProfile.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            const data = JSON.parse(this.responseText).data;
            that.setState({
                profile_picture: data.profile_picture,
                username: data.username,
                media: data.counts.media,
                follows: data.counts.follows,
                followed_by: data.counts.followed_by,
                full_name: data.full_name
            }); 
        }
        });
        xhrUserProfile.open("GET", this.props.baseUrl + "users/self/?access_token=" + this.state.access_token);
        //xhrUserProfile.setRequestHeader("Cache-Control", "no-cache");
        xhrUserProfile.send(dataUserProfile);

        // Get user posts
        let dataUserPosts = null;
        let xhrUserPosts = new XMLHttpRequest();
        xhrUserPosts.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                const data = JSON.parse(this.responseText).data;
                that.setState({ 
                    userPosts: [...data] ,
                    filteredUserPosts: [...data]
                });
            }
        });
        xhrUserPosts.open("GET", this.props.baseUrl + "users/self/media/recent?access_token=" + this.state.access_token);
        //xhrUserPosts.setRequestHeader("Cache-Control", "no-cache");
        xhrUserPosts.send(dataUserPosts);

    }

    likesClickHandler = ( _id, _index) => {

        let _userPosts = JSON.parse(JSON.stringify(this.state.userPosts));
        let _filteredPosts = JSON.parse(JSON.stringify(this.state.filteredUserPosts));

        if(_userPosts !== null && _userPosts.length > 0){

            // Updating main array
            let _updatedPosts =  _userPosts.map((post,index) => {
                if(post.id === _id){
                    if (post.user_has_liked) {
                        post.user_has_liked = false;
                        post.likes.count = (post.likes.count) - 1;
                    } else {
                       post.user_has_liked = true;
                       post.likes.count = (post.likes.count) + 1;
                    }
                }
                return post;
            });
            
            // Updating filtered array
            if(_filteredPosts !== null && _filteredPosts.length > 0) {
                if(_filteredPosts[_index].user_has_liked ) {
                    _filteredPosts[_index].user_has_liked = false;
                    _filteredPosts[_index].likes.count = (_filteredPosts[_index].likes.count) + 1;
                } else {
                    _filteredPosts[_index].user_has_liked = true;
                    _filteredPosts[_index].likes.count = (_filteredPosts[_index].likes.count) - 1;
                }
            } 
            
            // setting updated arrays to state
            this.setState({
                userPosts: [..._updatedPosts],
                filteredUserPosts: [..._filteredPosts]
            });
        }
    }

    applyFilter = (e) => {
        const _searchText = (e.target.value).toLowerCase();
        let _userPosts = JSON.parse(JSON.stringify(this.state.userPosts));
        let _filteredPosts = [];
        if(_userPosts !== null && _userPosts.length > 0){
            _filteredPosts = _userPosts.filter((post) => 
                 (post.caption.text.split('\n')[0].toLowerCase()).indexOf(_searchText) > -1 
            );
            this.setState({
                filteredUserPosts: [..._filteredPosts]
            });
        }
    }

    getYear = (_milliseconds)  => {
        return moment(new Date(parseInt(_milliseconds))).format('DD/MM/YY HH:mm:ss');
    }



    /**
     * @memberof Home
     * @description Adding new comments to post
     */
    addCommentClickHandler = (_id, _index) => {

        const _commentField = document.getElementById('addcomment'+_id);
        const _commentValue = _commentField.value;

        if (_commentValue === '') {
            return;
        } else {
            let _userPosts = JSON.parse(JSON.stringify(this.state.userPosts));
            let _filteredPosts = JSON.parse(JSON.stringify(this.state.filteredUserPosts));

            // Updating main array
            let _updatedPosts =  _userPosts.map((post,index) => {
                if(post.id === _id){
                    post.comments['data'] = post.comments['data'] || [];
                    post.comments['data'].push({
                        id: (post.comments['data'].length + 1) ,
                        comment_by: this.state.username,
                        comment_value: _commentValue
                    });

                }
                return post;
            });
            
            // Updating filtered array
            if(_filteredPosts !== null && _filteredPosts.length > 0) {
                _filteredPosts[_index].comments['data'] = _filteredPosts[_index].comments['data'] || [];
                _filteredPosts[_index].comments['data'].push({
                        id: (_filteredPosts[_index].comments['data'].length + 1) ,
                        comment_by: this.state.username,
                        comment_value: _commentValue
                });
            } 
            
            // setting updated arrays to state
            this.setState({
                userPosts: [..._updatedPosts],
                filteredUserPosts: [..._filteredPosts]
            });

            // Reset field value
            document.getElementById('addcomment'+_id).value = '';

        }
    }


    render(){
        return(
            <div>
                <Header profileIcon={true} profilePicture={this.state.profile_picture} profileUserName={this.state.username} searchChangeHandler={this.applyFilter}/>
                <Container fixed style={{ 'marginLeft':110, 'marginTop': 20}}>
                    <Grid container spacing={2}>                
                        {(this.state.filteredUserPosts || []).map((post, index) => (
                            <Grid item xs={12} sm={6} key={post.id}>
                                <Card className="postcard" key={post.id}>
                                    <CardHeader
                                        avatar={
                                        <Avatar aria-label="Recipe" className="classes.avatar"
                                        alt={post.user.username} 
                                        src={post.user.profile_picture} >
                                        </Avatar>
                                        }
                                        title={post.user.username}
                                        subheader={moment.unix(post.created_time).format("DD/MM/YYYY HH:mm:ss")}
                                    />
                                    <CardMedia
                                        className="classes.media"
                                        image={post.images.standard_resolution.url}
                                        title={(post.caption.text).split('\n')[0]}
                                        style={{ 'height': 320, 'width':'95%', 'margin': (0, 0, 0, 15)}}
                                    />
                                    
                                    <CardContent>
                                        <Divider dark="true" />    
                                        <Grid container spacing={3} justify="flex-start" alignItems="center">
                                            <Grid item >
                                                <Typography variant="caption">
                                                    {(post.caption.text.split('\n')[0])}
                                                    <br />
                                                    {(post.tags || []).map((tag, i) => {
                                                    return <Typography key={i} variant="caption" color="primary"> #{tag}
                                                            </Typography>
                                                })}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1} justify="flex-start" alignItems="center">
                                            <Grid item>
                                                
                                            {post.user_has_liked ? 
                                                    <FavoriteBorder className={'greyColor'} 
                                                                    onClick={this.likesClickHandler.bind(this, post.id, index)} 
                                                    />
                                                    :
                                                    <Favorite className={'redColor'} 
                                                              onClick={this.likesClickHandler.bind(this, post.id, index)} 
                                                    />                                                                                                       
                                                }
                                            </Grid>
                                            <Grid item >
                                                <Typography variant="caption">
                                                    {(post.likes.count)} likes
                                                </Typography>
                                            </Grid>
                                        </Grid>                                        
                                        <Grid container spacing={1} justify="flex-start" alignItems="center">
                                          <Grid item className="comments-min-height">
                                            {(post.comments.data || []).map((comment, i) => {
                                          return <Typography key={comment.id} variant="caption" display="block">
                                                    <strong>{comment.comment_by} :</strong> {comment.comment_value}
                                                        </Typography>
                                                })}
                                            </Grid>
                                        </Grid>                                                    
                                        <Grid container spacing={2} justify="flex-start" alignItems="center">
                                            <Grid item className="flex-grow-1">
                                                <FormControl className="formControl">
                                                    <InputLabel htmlFor="addcomment">Add a comment </InputLabel>
                                                    <Input id={"addcomment"+ post.id } type="text" />
                                                </FormControl>
                                            </Grid>
                                            <Grid item >
                                                <Button variant="contained" color="primary" onClick={this.addCommentClickHandler.bind(this, post.id, index)}>
                                                    ADD
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </CardContent>
                                    
                                </Card>
                            </Grid>
                            ))}
                    </Grid>
                </Container>
            </div>
        )
    }

}

export default Home;