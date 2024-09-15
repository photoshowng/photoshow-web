import { Button, Input, TextField, TextareaAutosize, Typography, makeStyles } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { ref, set, update } from 'firebase/database';
import { database, storage, storeRef } from '../Firebase';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import ForumIcon from '@material-ui/icons/Forum';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { Send } from '@material-ui/icons';
import "../Assets/Styles/Photographer.css"

const useStyles = makeStyles((theme) => ({
    PostsPage: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
        position:'relative',
        marginBottom: "110px",
        [theme.breakpoints.down('sm')]: {
            width: "75vw",
        },
    },
    postActions: {
        display: "flex",
        [theme.breakpoints.down('sm')]: {
            width: "70vw",
        },
    },
    heading: {
        margin: "15px auto",
        fontSize: "25px",
        fontWeight: 600,
        textTransform: "uppercase"
    },
    form: {
        width: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        borderRadius: "15px",
        border: "1px solid #ccc",
        marginTop: "20px"
    },
    inputs: {
        width: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "5px",
    },
    input: {
        width: "60%",
        margin: "5px",
        padding: 0,
    },
    button: {
        margin: "20px 20px 40px 20px",
        width: "150px",
        [theme.breakpoints.down('sm')]: {
            fontSize: "10px",
        },
    },
    posts: {
        width: "90%",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    post: {
        margin: "10px",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #000",
        borderRadius: "15px",
        padding: "5px"
    },
    texts: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "10px"
    },
    postImg: {
        width: "300px",
        height: "300px",
    },
    postTitle: {
        margin: 0,
        textTransform: "capitalize",
        fontSize: "20px",
        fontWeight: 600,
    },
    postContent: {
        margin: 0,
        textTransform: "capitalize",
        fontSize: "20px",
    },
    commentText: {
        margin: "5px 5px 30px 5px",
        width: "98%",
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

const PostsPage = ({data}) => {

    const [error, setError] = useState('')

    const [posts, setPosts] = useState([])
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState('');

    const [showReply, setShowReply] = useState(false)
    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
    const [replyText, setReplyText] = useState("")
    const [replies, setReplies] = useState([])

    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);  // Define the comments state
    const [activeCommentPostId, setActiveCommentPostId] = useState(null); // Track which post's comments are being shown

    const classes = useStyles();
    //const photographer = data;
    const [photographer, setPhotographer] = useState([])

    useEffect(() => {
        if (!data) return;
            //const photographer = data;
        setPhotographer(data)
        const postsArray = photographer?.posts ? Object.values(photographer.posts) : [];
        setPosts(postsArray);
      }, [data, photographer])

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const fileInputRef = useRef(null);


    const handleUpload = async () => {
        return new Promise((resolve, reject) => {
            if (!image) {
                reject("No image selected");
                return;
            }

            const storageRef = storeRef(storage, `Images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Progress function
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    // Error function
                    setError(error);
                    reject(error);
                },
                () => {
                    // Complete function
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setUrl(downloadURL);
                        setImage(null);
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const AddPostToDatabase = async (event) => {
        event.preventDefault();

        if (!postTitle || !postContent || !image) {
            alert('Please fill in all fields and select an image');
            return;
        }

        try {
            const downloadURL = await handleUpload();
            const id = uuidv4();

            const newPost = {
                postId: id,
                title: postTitle,
                content: postContent,
                image: downloadURL,
                postedAt: new Date().toISOString(), // Optionally include a timestamp
            };

            const postsRef = ref(database, `Photographers/${photographer.id}/posts/${id}`);
            await set(postsRef, newPost);
            setPostTitle(''); // Clear the form
            setPostContent('');
            setProgress(0); // Reset progress
            setImage(null)

            // Clear file input manually
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const updateUserDataa = async (path, newData) => {
        try {
          // Reference to the user's data
          const userRef = ref(database, path);
      
          // Update the user's profile with new data
          await update(userRef, newData);
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
          setComments([...comments, newComment])
        } catch (error) {
          console.error('Error updating user profile:', error);
          alert('error')
        }
      };
    
      const likePost = (postId) => {
        if (!photographer) return;
      
        const like = () => {
          const postLikes = photographer?.posts?.[postId]?.postLikes || [];
          const postsLiked = photographer?.postsLiked || [];
          const newPhotographerData1 = {
            postLikes: [...postLikes, photographer.id],
          };

          const newPhotographerData2 = {
            postsLiked: [...postsLiked, postId]
          };
      
          //updateUserDataa(`Users/${data?.userId}`, newUserData);
          updateUserDataa(`Photographers/${photographer.id}/posts/${postId}`, newPhotographerData1);
          updateUserDataa(`Photographers/${photographer.id}`, newPhotographerData2);
        };
      
        const disLike = () => {      
            const postLikes = photographer?.posts?.[postId]?.postLikes || [];
            const postsLiked = photographer?.postsLiked || [];
        
            // Update the post's likes (removing photographer.id)
            const newPhotographerData1 = {
                postLikes: postLikes.filter(userId => userId !== photographer.id),
            };
        
            // Update the photographer's postsLiked (removing postId)
            const newPhotographerData2 = {
                postsLiked: postsLiked.filter(id => id !== postId)
            };
            // Update the post's likes in Firebase
            updateUserDataa(`Photographers/${photographer.id}/posts/${postId}`, newPhotographerData1);
        
            // Update the photographer's postsLiked list in Firebase
            updateUserDataa(`Photographers/${photographer.id}`, newPhotographerData2);
        };
        
      
        if (photographer?.postsLiked?.includes(postId)) {
          disLike();
        } else {
          like();
        }
      };

      const getComments = (postId) => {
        const currentPost = posts.find(post => post.postId === postId);
        const commentsArray = currentPost?.comments
            ? Object.values(currentPost.comments)
            : [];
        setComments(commentsArray);
    };

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
        const commentId = uuidv4();
        const newComment = {
            comment: commentText,
            date: new Date().toLocaleString(),
            userCommented: photographer.userName,
            commentId: commentId,
            userCommentedId: photographer.id,
            postCommentedOn: postId,
        };
        saveComment(`Users/${data?.userId}/userComments/${commentId}`, newComment, postId);
        saveComment(`Photographers/${photographer.id}/posts/${postId}/comments/${commentId}`, newComment, postId);
        setCommentText('');
        setComments([...comments, newComment]);
    };

    const saveReply = async (path, newReply, postId) => {
        try {
          // Reference to the user's data
          const userRef = ref(database, path);
      
          // Update the user's profile with new data
          await update(userRef, newReply);
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
                userReplied: photographer.userName,
                replyId: replyId,
                //userCommentedId: photographer.id,
                commentRepliedOn: commentId,
            };
            //saveReply(`Users/${data?.userId}/userComments/${commentId}`, newReply, commentId);
            saveReply(`Photographers/${photographer.id}/posts/${postId}/comments/${commentId}/replies/${replyId}`, newReply, commentId);
            setReplyText('');
            setReplies([...replies, newReply]);
            setActiveReplyCommentId(null)
        } else {
            setError("reply cant be empty")
        }
    };

    return (
        <div className={classes.PostsPage}>
            <form className={classes.form} onSubmit={AddPostToDatabase}>
                <Typography variant="h4" align="center" gutterBottom className={classes.heading}>
                    New Post
                </Typography>
                <div className={classes.inputs}>
                    <TextField
                        variant="outlined"
                        label="Title"
                        name="title"
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className={classes.input}
                    />
                    <TextField
                        variant="outlined"
                        label="Content"
                        name="content"
                        type="text"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className={classes.input}
                    />
                    <Input
                        variant="outlined"
                        className={classes.input}
                        type="file"
                        name="image"
                        onChange={handleChange}
                        inputRef={fileInputRef}
                    />  
                    {/* <progress value={progress} max="100" /> */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                    >
                        Post
                    </Button>
                </div>
            </form>
            <div className={classes.posts}>
            {photographer && posts && Array.isArray(posts) ? (
              posts.map((post, index) => (
                <div className='post' key={post.postId}>
                  <div className='post-details'>
                    <p className={classes.postContent}>{post.content}</p>
                  </div>
                  <img src={post.image} alt='user img' className='post-img img'/>
                  <div className={classes.postActions}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                    //   endIcon={<ThumbUpIcon />}
                      key={index}
                      onClick={() => likePost(post.postId)}
                    >
                      {photographer?.postsLiked?.includes(post.postId) ? `UnLike ${post?.postLikes?.length || 0}` : `Like ${post?.postLikes?.length || 0}`}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                    //   endIcon={<ForumIcon />}
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
            ) : (
              <p>No posts available</p>
            )}
            </div>
        </div>
    );
}

export default PostsPage;
