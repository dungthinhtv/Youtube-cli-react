import React, { useEffect, useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import Comments from '../components/Comments';
import Card from '../components/Card';
import './video.css';

import {
  Container,
  Content,
  VideoWrapper,
  Title,
  Details,
  Info,
  Buttons,
  Button,
  Channel,
  ChannelInfo,
  Image,
  ChannelDetail,
  ChannelName,
  ChannelCounter,
  Description,
  Subscribe,
  Recommendation,
  Hr,
} from './css';

// Custom
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { dislike, fetchSuccess, like } from '../redux/videoSlice';
import { format } from 'timeago.js';
import { subscription } from '../redux/userSlice';
import { API_URL } from '../constants';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split('/')[2];

  const [channel, setChannel] = useState({});

  // const [frameHeight, setFrameHeight] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`${API_URL}/videos/find/${path}`);

        const channelRes = await axios.get(
          `${API_URL}/users/find/${videoRes.data.userId}`
        ); // console.log(channelRes.data);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    // const frame = document.getElementById('myFrame');
    // console.log(
    //   'height',
    //   frame.contentWindow.document.body.scrollHeight + 'px'
    // );
    // setTimeout(() => {
    //   setFrameHeight(frame.contentWindow.document.body.scrollHeight + 'px');
    // }, 100);
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(`${API_URL}/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
  };
  const handleDislike = async () => {
    await axios.put(`${API_URL}/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`${API_URL}/users/unsub/${channel._id}`)
      : await axios.put(`${API_URL}/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <div class="container">
            <iframe
              className="responsive-iframe"
              src={currentVideo?.videoUrl}
              title={currentVideo?.title}
              frameBorder="0"
              allowFullScreen
              // id="myFrame"
              width="100%"
              // height={frameHeight}
            />
          </div>
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views} views • {format(currentVideo?.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{' '}
              {currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{' '}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers}</ChannelCounter>
              <Description>{currentVideo?.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {channel.subscribedUsers?.includes(channel._id)
              ? 'SUBSCRIBED'
              : 'SUBSCRIBE'}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>
      <Recommendation></Recommendation>
    </Container>
  );
};

export default Video;
