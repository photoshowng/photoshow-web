import React, { useEffect, useState } from 'react';
import '../Assets/Styles/Photographer.css';
import { useParams } from 'react-router-dom';
import Image1 from '../Assets/Images/Image1.jpg';
import { Button, TextField, TextareaAutosize, makeStyles } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ForumIcon from '@material-ui/icons/Forum';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CloseIcon from '@material-ui/icons/Close';
import { Send } from '@material-ui/icons';
import { useData } from '../Context/DataContext';
import { updateUserData } from '../DataOperations';
import { ref, update } from 'firebase/database';
import { database } from '../Firebase';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
    backgroundColor: '#3248a8',
    '&:hover': {
      backgroundColor: '#007bff',
    },
  },
  replyBtn: {
    margin: theme.spacing(2),
    '&:hover': {
      color: '#007bff',
    },
    textTransform: "capitalize",
    position: "absolute",
    bottom: "5px",
    left: 0,
    fontSize: "12px",
    marginBottom: "-5px",
  },
  replies: {
    width: "100%",
},
reply: {
    width: "100%",
    boxShadow: "2px 2px #ccc",
},
replyUser: {
    padding: "5px",
    margin: 0,
    fontSize: "13px",
    fontWeight: 800,
},
replyText: {
    padding: "5px",
    margin: "5px",
},
}));

const Photographer = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [followText, setFollowText] = useState("Follow");
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);  // Define the comments state
  const [error, setError] = useState("")

  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("")
  const [replies, setReplies] = useState([])
  const [activeCommentPostId, setActiveCommentPostId] = useState(null); // Track which post's comments are being shown

  const { data, photographers, loading } = useData();

  useEffect(() => {
    if (loading) return;

    // Find the photographer by ID and convert posts object to array
    const foundPhotographer = photographers?.find(p => p.id === id);

    if (foundPhotographer) {
      // Convert posts object to an array
      const postsArray = foundPhotographer.posts
        ? Object.keys(foundPhotographer.posts).map(key => foundPhotographer.posts[key])
        : [];
      
      setPhotographer({ ...foundPhotographer, posts: postsArray });
    }

    console.log(data, photographers, loading, id, photographer);
  }, [data, photographers, loading, id]);

  const followPage = () => {
    if (!photographer) return;

    const follow = () => {
      const newUserData = {
        pagesFollowed: data?.pagesFollowed ? [...data.pagesFollowed, photographer.id] : [photographer.id]
      };
      const newPhotographerData = {
        followers: photographer?.followers ? [...photographer.followers, data.userId] : [data.userId]
      };
      updateUserData("Users", data?.userId, newUserData);
      updateUserData("Photographers", photographer?.id, newPhotographerData);
      setFollowText("UnFollow");
    };
    
    const unFollow = () => {
      const newUserData = {
        pagesFollowed: data?.pagesFollowed?.filter(page => page !== photographer.id)
      };
      const newPhotographerData = {
        followers: photographer?.followers?.filter(user => user !== data.userId)
      };
      updateUserData("Users", data.userId, newUserData);
      updateUserData("Photographers", photographer.id, newPhotographerData);
      setFollowText("Follow");
    };

    if (data?.pagesFollowed?.includes(photographer.id)) {
      unFollow();
    } else {
      follow();
    }
  };

  const updateUserDataa = async (path, newData) => {
    try {
      // Reference to the user's data
      const userRef = ref(database, path);
  
      // Update the user's profile with new data
      await update(userRef, newData);
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('error')
    }
  };

  const saveComment = async (path, newComment, postId) => {
    try {
      // Reference to the user's data
      const userRef = ref(database, path);
  
      // Update the user's profile with new data
      await update(userRef, newComment);
      console.log('User profile updated successfully');
      setComments([...comments, newComment])
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('error')
    }
  };

  const likePost = (postId) => {
    console.log(postId);
    if (!photographer) return;
  
    const like = () => {
      const newUserData = {
        postsLiked: data?.postsLiked ? [...data.postsLiked, postId] : [postId]
      };
  
      // Filter out any undefined values
      newUserData.postsLiked = newUserData.postsLiked.filter(postId => postId !== undefined);
  
      const postLikes = photographer?.posts?.[postId]?.postLikes || [];
      const newPhotographerData = {
        postLikes: [...postLikes, data.userId]
      };

      console.log(newUserData);
      console.log(newPhotographerData);
      console.log(postId)

  
      updateUserDataa(`Users/${data?.userId}`, newUserData);
      updateUserDataa(`Photographers/${photographer.id}/posts/${postId}`, newPhotographerData);
    };
  
    const disLike = () => {
      const newUserData = {
        postsLiked: data?.postsLiked?.filter(likedPostId => likedPostId !== postId)
      };
  
      // Filter out any undefined values
      newUserData.postsLiked = newUserData.postsLiked.filter(postId => postId !== undefined);;
  
      const postLikes = photographer?.posts?.[postId]?.postLikes || [];
      const newPhotographerData = {
        postLikes: postLikes.filter(userId => userId !== data.userId)
      };

      console.log(newUserData);
      console.log(newPhotographerData);
      console.log(postId)
  
      updateUserDataa(`Users/${data?.userId}`, newUserData);
      updateUserDataa(`Photographers/${photographer.id}/posts/${postId}`, newPhotographerData);
    };
  
    if (data?.postsLiked?.includes(postId)) {
      disLike();
    } else {
      like();
    }
  };
  

  const toWhatsapp = () => {
    const whatsappNumber = photographer?.whatsappNumber;
    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const toFacebook = () => {
    const facebookUrl = 'https://www.facebook.com/ajbindawa';
    window.open(facebookUrl, '_blank');
  };

  const toGmail = () => {
    const email = photographer?.userEmail;
    if (email) {
      const subject = 'Contacting From PhotoShow';
      const body = 'Write Your Message.';
      const gmailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    }
  };

  const getComments = (postId) => {
    const currentPost = photographer.posts.filter(post => post.postId === postId);

    const commentsArray = currentPost[0].comments
        ? Object.keys(currentPost[0].comments).map(key => currentPost[0].comments[key])
        : [];

    setComments(commentsArray)
  }

  const showCommentPopupWindow = (postId) => {
    if (activeCommentPostId === postId) {
        setActiveCommentPostId(null); // Close the popup if clicked again
    } else {
        setActiveCommentPostId(postId); // Open the popup for the clicked post
        getComments(postId);
    }
};

  const handleChangeCommentText = (e) => {
    setCommentText(e.target.value);
  };

  const sendComment = (postId) => {
    const commentId = uuidv4()
    const newComment = { 
      comment: commentText, 
      date: new Date().toLocaleString(), 
      userCommented: data.userName,
      commentId: commentId,
      userCommentedId: data.userId,
      postCommentedOn: postId,
    };
    saveComment(`Users/${data?.userId}/userComments/${commentId}`, newComment, postId);
    saveComment(`Photographers/${photographer.id}/posts/${postId}/comments/${commentId}`, newComment, postId);
    setCommentText('');
    
    setComments([...comments, newComment])
  };

  const BookingPopup = () => (
    <div className='booking-popup'>
      <div className='booking-popup-close'>
        <CloseIcon onClick={() => setShowBookingPopup(false)} />
      </div>
      <h3>Make Booking</h3>
      <p style={{color: "#4CAF50"}} onClick={toWhatsapp}>Contact Via WhatsApp</p>
      <p style={{color: "rgb(20, 20, 200)"}} onClick={toFacebook}>Contact Via Facebook</p>
      <p style={{color: "rgb(250, 10, 10)"}} onClick={toGmail}>Contact Via Gmail</p>
    </div>
  );

  const saveReply = async (path, newReply, postId) => {
    try {
      // Reference to the user's data
      const userRef = ref(database, path);
  
      // Update the user's profile with new data
      await update(userRef, newReply);
      console.log('User profile updated successfully');
      setReplies([...replies, newReply])
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('error')
    }
  };

const sendReply = (commentId, postId) => {
    if (replyText !== "") {
        const replyId = uuidv4();
        const newReply = {
            reply: replyText,
            date: new Date().toLocaleString(),
            userReplied: data.userName,
            replyId: replyId,
            //userCommentedId: photographer.id,
            commentRepliedOn: commentId,
        };
        //saveReply(`Users/${data?.userId}/userComments/${commentId}`, newReply, commentId);
        saveReply(`Photographers/${photographer.id}/posts/${postId}/comments/${commentId}/replies/${replyId}`, newReply, commentId);
        setReplyText('');
        setReplies([...replies, newReply]);
        setActiveReplyCommentId(null)
        console.log("reply sent");
    } else {
        setError("reply cant be empty")
        console.log("reply not sent");
    }
};

const getReplies = (postId, commentId) => {
  // Find the specific post
  const currentPost = photographer.posts.find(post => post.postId === postId);

  if (!currentPost) {
    console.error(`Post with ID ${postId} not found.`);
    return;
  }

  // Find the specific comment
  const comment = currentPost.comments ? currentPost.comments[commentId] : null;

  if (!comment) {
    console.error(`Comment with ID ${commentId} not found.`);
    return;
  }

  console.log('Replies for this comment:', comment.replies);

  // Map through replies
  const repliesArray = comment.replies
    ? Object.keys(comment.replies).map(key => comment.replies[key])
    : [];

  setReplies(repliesArray);
};

  return (
    <div className='main'>
  {showBookingPopup ? <BookingPopup /> : (
    <>
      <div className='photographer-info'>
        <img src={photographer?.image} alt='user img' className='hero-img img'/>
        <div className='image-container'>
          <img src={photographer?.image} alt='user img' className='sub-img img'/>
        </div>
        <div className='photographer-details'>
          <h4>{photographer?.userName}</h4>
          <h5>{photographer?.location}</h5>
          <p>{photographer?.userEmail}</p>
        </div>
        <div className='photographer-actions'>
          <h5>Followers ({photographer?.followers?.length || 0})</h5>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<PersonAddIcon />}
            onClick={followPage}
          >
            {data?.pagesFollowed?.includes(photographer?.id) ? "Unfollow" : "Follow"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<PersonAddIcon />}
            onClick={() => setShowBookingPopup(true)}
          >
            Booking
          </Button>
        </div>
      </div>

      <div className='photographer-posts'>
        <h4>Recent Posts</h4>
        {photographer?.posts?.length ? (
          photographer.posts.map((post, index) => (
            <div className='post' key={index}>
              <div className='post-details'>
                <p>{post.content}</p>
              </div>
              <img src={post.image} alt='user img' className='post-img img'/>
              <div className='post-actions'>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<ThumbUpIcon />}
                  onClick={() => likePost(post.postId, index)}
                >
                  {data?.postsLiked?.includes(post.postId) ? `UnLike ${post?.postLikes?.length || 0}` : `Like ${post?.postLikes?.length || 0}`}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<ForumIcon />}
                  onClick={() => showCommentPopupWindow(post.postId)}
                >
                  Comment
                </Button>
              </div>

              {activeCommentPostId === post.postId && (
                    <div className="comment-section">
                    <div className="comments">
                        {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div className="comment" key={index}>
                                <h5 className="user">{comment.userCommented}</h5>
                                <p className={classes.commentText}>{comment.comment}</p>
                                <p className="date">{comment.date}</p>
                                <Button
                                className={classes.replyBtn}
                                onClick={() => {
                                    activeReplyCommentId === null ? setActiveReplyCommentId(comment.commentId) : setActiveReplyCommentId(null)
                                    getComments(post.postId)
                                }} // Set the active comment for reply
                                >
                                Reply
                                </Button>
                            {/* Show reply form only for the active comment */}
                            {activeReplyCommentId === comment.commentId && (
                                <>
                                {comment.replies && Object.keys(comment.replies).length > 0 ? (
                                    <div className={classes.replies}>
                                    {Object.keys(comment.replies).map((replyKey) => {
                                        const reply = comment.replies[replyKey];
                                        return (
                                        <div key={replyKey} className={classes.reply}>
                                            <h6 className={classes.replyUser}>{reply.userReplied}</h6>
                                            <p className={classes.replyText}>{reply.reply}</p>
                                        </div>
                                        );
                                    })}
                                    </div>
                                ) : <p>No replies yet</p>}
                                <form className="comment-form">
                                <TextareaAutosize
                                    minRows={3}
                                    maxRows={10}
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="comment-textarea"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    endIcon={<Send />}
                                    onClick={() => {
                                    sendReply(comment.commentId, post.postId);
                                    setActiveReplyCommentId(null); // Close the reply form after sending
                                    }}
                                >
                                    Reply
                                </Button>
                                </form>
                                </>
                            )}
                            </div>
                        ))
                        ) : (
                        <p>No comments yet.</p>
                        )}
                    </div>

                    {/* Comment form for new comments */}
                    <form className="comment-form">
                        <TextareaAutosize
                        minRows={3}
                        maxRows={10}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={handleChangeCommentText}
                        className="comment-textarea"
                        />
                        <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<Send />}
                        onClick={() => sendComment(post.postId)}
                        >
                        Send
                        </Button>
                    </form>
                    </div>
                )}
            </div>
          ))
        ) : <p>No posts available</p>}
      </div>
    </>
  )}
</div>

  );
};

export default Photographer;
