import React, { Component } from 'react';
import './Profile.css';
import Header from '../../common/header/Header';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
  }));

class Profile extends Component {
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

        // Bug Fix - We dont need to set Cache-Control & Access-Control-Allow-Origin
        // Refer - https://learn.upgrad.com/v/course/167/question/129054
        //xhrUserProfile.setRequestHeader("Cache-Control", "no-cache");
        //xhrUserProfile.setRequestHeader("Access-Control-Allow-Origin", "*");
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
        // Bug Fix - We dont need to set Cache-Control & Access-Control-Allow-Origin
        // Refer - https://learn.upgrad.com/v/course/167/question/129054
        //xhrUserPosts.setRequestHeader("Cache-Control", "no-cache");
        //xhrUserPosts.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhrUserPosts.send(dataUserPosts);

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


    render(){
        return(
            <div className={useStyles.root}>
                <Header profileIcon={true} profilePicture={this.state.profile_picture} profileUserName={this.state.username} searchChangeHandler={this.applyFilter}/>
                <div>
                <GridList cellHeight={300} className={useStyles.gridList} cols={3}>
                {
                    (this.state.filteredUserPosts || []).map((data, index) => (
                        <GridListTile key={data.id} cols={data.cols || 1}>
                        <img src={data.images.low_resolution.url} alt={(data.caption.text).split('\n')[0]} />
                    </GridListTile>
                    ))
                }
      </GridList>
    </div>
            </div>
        )
    }

}
export default Profile;