import type { NextPage } from 'next';
import PageContent from '../components/Layout/PageContent';
import CreatePostLink from '../components/Community/CreatePostLink';
import Posts from '../components/Posts/Posts';
import About from '../components/Community/About';
import { Community } from '../atoms/communitiesAtom';
import useAuthUser from '../hooks/useAuthUser';
import { auth, firestore } from '../firebase/clientApp';
import { useEffect, useState } from 'react';
import useCommunityData from '../hooks/useCommunityData';
import { query, collection, orderBy, limit, getDocs, where } from 'firebase/firestore';
import usePosts from '../hooks/usePosts';
import { Post, PostVote } from '../atoms/postsAtom';
import PostLoader from '../components/Posts/PostLoader';
import { Stack } from '@chakra-ui/react';
import PostItem from '../components/Posts/PostItem';
import { onAuthStateChanged } from 'firebase/auth';
import TopCommunities from '../components/Community/TopCommunities';
import PersonalHome from '../components/Community/PersonalHome';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const { communityStateValue } = useCommunityData();
  const [userLoading, setUserLoading] = useState(true);
  const { setPostStateValue, postStateValue, onVote, onDeletePost, onSelectPost } = usePosts();

  const buildUserHomeFeed = async () => {
    if (communityStateValue.mySnippets.length) {
      const myCommunities = communityStateValue.mySnippets.map(item => item.communityId);
      setLoading(true);
      try {
        const postQuery = query(collection(firestore, 'posts'),
          where('communityId', 'in', myCommunities),
          orderBy('createdAt', 'desc'),
          limit(10));
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setPostStateValue(prev => ({
          ...prev,
          posts: posts
        }))
      } catch (error) {
        console.log('buildUserHomeFeed error: ' + error);
      }

      setLoading(false);

    }

  }

  const buildHomeFeed = async () => {
    setLoading(true);
    console.log('buldingHomeFeed')
    try {
      const postQuery = query(collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10));
      console.log(postQuery);
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      console.log(posts);
      setPostStateValue(prev => ({
        ...prev,
        posts: posts,
      }));

    } catch (error) {
      console.log('buildHomeFeed error: ' + error);
    }

    setLoading(false);

  }

  const getHomePageView = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        buildUserHomeFeed();
      }
      else {
        buildHomeFeed();
      }
    })

    //cleanup function
    return () => {
      setPostStateValue(prev => ({
        posts: [],
        selectedPost: prev.selectedPost,
        postVotes: [],
      }))
    }
  }

  useEffect(() => {
    getHomePageView();
  }, [auth.currentUser]);

  return (
    <PageContent>
      <>
        {loading ? <PostLoader /> :
          <Stack>
            {postStateValue.posts && postStateValue.posts.map(item => {
              return (<>
                <PostItem key={item!.id}
                  post={item!}
                  userIsCreator={auth.currentUser?.uid === item!.creatorId}
                  userVoteValue={(postStateValue.postVotes.find(vote => vote?.postId === item.id)?.voteValue ?
                    postStateValue.postVotes.find((vote: PostVote) => vote.postId === item.id)!.voteValue : 0)}
                  onVote={onVote}
                  onSelectPost={onSelectPost}
                  onDeletePost={onDeletePost}
                  homePage={true}
                />
              </>)
            })}
          </Stack>}
      </>
      <>
        <About />
      </>
    </PageContent>
  )
};

export default Home;
