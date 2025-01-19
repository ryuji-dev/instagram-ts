interface Post {
  id: number;
  likes: number;
  comments: number;
  image: string;
  text: string;
}

// initial user profile
const defaultProfile = {
  id: "hello.world",
  img: "assets/default_profile.svg",
  name: "헬로월드",
  description: "안녕하세요! 저는 헬로월드입니다.",
  link: "https://www.instagram.com/hello.world",
  posts: 0,
  followers: 103,
  following: 96,
};

const postModal = document.querySelector('.post-modal');
const addPost = document.querySelector('#add-post');
const addPostModal = document.querySelector(".add-post-modal") as HTMLDialogElement;
const addPostModalPost = document.querySelector(".add-post-modal__post");
const addPostFileInput = document.getElementById("add-post-file");
const addPostModalCloseBtn = addPostModal && addPostModal.querySelector(".modal__close-button");
const addPostShareBtn = document.getElementById("add-post-share");
const addPostModalTextarea = addPostModal && (addPostModal.querySelector(".add-post-modal__textarea") as HTMLTextAreaElement);
const postsGallery = document.querySelector('.posts__gallary');

const profileImg = document.getElementById('profile-img');
const profileId = document.getElementById('profile-id');
const profilePosts = document.getElementById('profile-posts');
const profileFollowers = document.getElementById('profile-followers');
const profileFollowing = document.getElementById('profile-following');
const profileName = document.getElementById('profile-name');
const profileDescription = document.getElementById('profile-description');
const profileLink = document.getElementById('profile-link');

const updateProfileImg = document.getElementById('update-profile-img');
const updateProfileId = document.getElementById('update-profile-id') as HTMLInputElement;
const updateProfileName = document.getElementById('update-profile-name') as HTMLInputElement;
const updateProfileDescription = document.getElementById('update-profile-description') as HTMLInputElement;
const updateProfileFile = document.getElementById("update-profile-file");
const updateProfileSave = document.getElementById("update-profile-save");
const updateProfileLink = document.getElementById('update-profile-link') as HTMLInputElement;
const updateProfileBtn = document.getElementById('update-profile-btn');
const updateProfileModal = document.querySelector(".update-profile-modal") as HTMLDialogElement;

let updateProfileCloseBtn: HTMLButtonElement | null = null;
if (updateProfileModal) {
    updateProfileCloseBtn = updateProfileModal.querySelector('.modal__close-button')
}

window.addEventListener('load', () => {
  initEvents();
  updateProfileUI();
});

function initEvents() {
  if (updateProfileBtn) {
    updateProfileBtn.addEventListener('click', () => updateProfileModal && updateProfileModal.showModal());
  }
  if (updateProfileSave) {
    updateProfileSave.addEventListener('click', handleUpdateProfileSave);
    if (updateProfileCloseBtn) {
      updateProfileCloseBtn.addEventListener("click", () => {
        updateProfileUI();
      });
    }
    if (updateProfileFile) updateProfileFile.addEventListener("change", handleFileInputChangeProfile);
  }
}

function updateUI() {
  updateProfileUI();
}

function updateProfileUI() {
  const profileString = localStorage.getItem('profile');
  const postsString = localStorage.getItem('posts');
  const profile = (typeof profileString === 'string' && JSON.parse(profileString)) || defaultProfile;
  const posts = (typeof postsString === 'string' && JSON.parse(postsString)) || [];

  document.title = `${profile.name} (@${profile.id}) - Instagram`;
  profile.posts = posts.length;

  if (profileImg && profileId && profilePosts && profileFollowers && profileFollowing && profileName && profileDescription && profileLink) {
    profileImg.setAttribute("src", profile.img);
    profileId.innerText = profile.id;

    const profilePostsStrong = profilePosts.querySelector('strong');
    if (profilePostsStrong) profilePostsStrong.innerText = profile.posts;

    const profileFollowersStrong = profileFollowers.querySelector("strong");
    if (profileFollowersStrong) profileFollowersStrong.innerText = profile.followers;

    const profileFollowingStrong = profileFollowing.querySelector("strong");
    if (profileFollowingStrong) profileFollowingStrong.innerText = profile.following;

    profileName.innerText = profile.name;
    profileDescription.innerText = profile.description;
    profileLink.innerText = profile.link;
    profileLink.setAttribute("href", profile.link);
  }

  if (updateProfileImg && updateProfileId && updateProfileName && updateProfileDescription && updateProfileLink) {
    updateProfileImg.setAttribute("src", profile.img);
    updateProfileId.value = profile.id;
    updateProfileName.value = profile.name;
    updateProfileDescription.value = profile.description;
    updateProfileLink.value = profile.link;
  }
}

function handleUpdateProfileSave() {
  const profileString = localStorage.getItem('profile');
  const { id, img, name, description, link, ...rest } = (typeof profileString === 'string' && JSON.parse(profileString)) || defaultProfile;

  if (!(updateProfileImg && updateProfileId && updateProfileName && updateProfileDescription && updateProfileLink)) return;
  
  const newProfile = {
    id: updateProfileId.value,
    img: updateProfileImg.getAttribute("src"),
    name: updateProfileName.value,
    description: updateProfileDescription.value,
    link: updateProfileLink.value,
    ...rest,
  }

  localStorage.setItem('profile', JSON.stringify(newProfile));

  updateProfileUI();
}

function handleFileInputChangeProfile(this: any) {
  const fr = new FileReader();

  fr.readAsDataURL(this.files[0]);

  const loadEvent = function (e: ProgressEvent<FileReader>) {
    if (updateProfileImg) {
      const result = fr.result;
      if (typeof result === 'string') {
        updateProfileImg.setAttribute("src", result);
      }
    }
  }

  fr.addEventListener("load", loadEvent);
}

function whichDialogOpen() {
  const allDialogs = Array.from(document.querySelectorAll('dialog.post-modal')) as HTMLDialogElement[];
  if (!allDialogs) return;

  const openedDialog = allDialogs.find(({ open }) => open);
  const parent = openedDialog && (openedDialog.parentNode as Element);
  if (parent) return parent.id;
}

function updatePostsUI() {
  const openedDialogPostId = whichDialogOpen();
  const postsString = localStorage.getItem('posts');
  const posts = (typeof postsString === 'string' && JSON.parse(postsString)) || [];

  if (!posts.length && postsGallery) {
    postsGallery.classList.add("posts__gallary--no-posts");
    postsGallery.innerHTML = `<div class="posts__no-posts">
      <div class="posts__circle">
        <img src="assets/camera_icon.svg" alt="camera_icon" />
      </div>
      <h3>게시물 없음</h3>
    </div>`;
    return;
  }

  if (postsGallery) postsGallery.classList.remove("posts__gallary--no-posts");
  const innterHTML = posts.reduce((acc: string, post: Post) => {
    return (
      acc +
      `<div class="post" id"post-${post.id}">
        <div class="post__info">
          <div class="post__info-item">
            <img src="assets/heart_icon.svg" alt="heart_icon" />
            ${post.likes}
          </div>
          <div class="post__info-item">
            <img src="assets/comment_icon.svg" alt="comment_icon" />
            ${post.comments}
          </div>
        </div>
        <img src="${post.image}" alt="post_${post.id}" />
        <dialog class="post-modal modal post-modal--view-mode">
          <form method="dialog">
            <img class="modal__image" src="${post.image}" alt="post-${post.id}" />
            <article class="post-modal__article">
              ${post.text}
            </article>
            <div class="post-modal__update">
              <textarea class="post-modal__textarea" placeholder="여기에 수정할 내용을 작성하세요.">${post.text}</textarea>
              <div class="post-modal__update-buttons">
                <button class="post-modal__update-submit-button">수정</button>
                <button class="post-modal__update-cancel-button">삭제</button>
              </div>
            </div>

            <div class="post-modal__buttons">
              <button class=""></button>
            </div>
          </form>
        </dialog>
      </div>`
    );
  }, "");

  if (postsGallery) postsGallery.innerHTML = innterHTML;

  posts.forEach(({ id, text }: Post) => {
    const post = document.getElementById(`post-${id}`);
    if (!post) return;

    const postModal = post.querySelector('.post-modal') as HTMLDialogElement;
    if (!postModal) return;
    if (openedDialogPostId === `post-${id}`) postModal.showModal();

    post.addEventListener('click', () => postModal.showModal());

    const postModalCloseBtn = postModal.querySelector('.modal__close-button');
    if (postModalCloseBtn) postModalCloseBtn.addEventListener('click', () => postModalUpdateToViewMode(postModal, text));

    const postModalDeleteBtn = post.querySelector(".post-modal__delete-button");
    if (postModalDeleteBtn) postModalDeleteBtn.addEventListener("click", () => { confirm("정말로 삭제하시겠습니까?") && deletePost(id) });

    const postModalUpdateBtn = post.querySelector('.post-modal__update-button');
    if (postModalUpdateBtn) postModalUpdateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      postModalViewToUpdateMode(postModal);
    });

    const postModalUpdateSubmitBtn = post.querySelector('.post-modal__update-submit-button');
    if (postModalUpdateSubmitBtn) postModalUpdateSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const postModalTextarea = postModal.querySelector('.post-modal__textarea') as HTMLTextAreaElement;
      
      if (postModalTextarea) updatePostsUI(); // id, postModalTextarea.value
    });

    const postModalUpdateCancelBtn = post.querySelector('.post-modal__update-cancel-button');
    if (postModalUpdateCancelBtn) postModalUpdateCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      postModalUpdateToViewMode(postModal, text);
    });
  });
}

function postModalViewToUpdateMode(postModal: HTMLDialogElement) {
  postModal.classList.remove('post-modal--view-mode');
  postModal.classList.add('post-modal--update-mode');
}

function postModalUpdateToViewMode(postModal: HTMLDialogElement, originText: string) {
  const textarea = postModal.querySelector('.post-modal__textarea') as HTMLTextAreaElement | null;
  if (textarea) {
    textarea.value = originText;
  }
  postModal.classList.add('post-modal--view-mode');
  postModal.classList.remove('post-modal--update-mode');
}

function createPost(image: string, text: string) {
  const postsString = localStorage.getItem('posts');

  const posts = (typeof postsString === 'string' && JSON.parse(postsString)) || [];
  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    likes: 0,
    comments: 3,
    image,
    text,
  };

  posts.push(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));

  updateUI();
}

function deletePost(id: number) {
  const postsString = localStorage.getItem('posts');
  const posts = (typeof postsString === 'string' && JSON.parse(postsString)) || [];

  if (!posts.length) return;

  localStorage.setItem('posts', JSON.stringify(posts.filter(({ id: postId }: Post) => id !== postId)));
  
  updateUI();
}

function updatePost(id: number, text: string) {
  const postsString = localStorage.getItem('posts');
  const posts = (typeof postsString === 'string' && JSON.parse(postsString)) || [];

  if (!posts.length) return;

  localStorage.setItem('posts', JSON.stringify(posts.map(({ id: postId, text: postText, ...rest }: Post) => id === postId ? { id: postId, text, ...rest } : { id: postId, text: postText, ...rest })));

  updatePostsUI();
}

function addModalShareToFileMode() {
  addPostModal.classList.remove('add-post-modal--share-mode');
  addPostModal.classList.add('add-post-modal--file-mode');
}

function addModalFileToShareMode() {
  addPostModal.classList.remove('add-post-modal--file-mode');
  addPostModal.classList.add('add-post-modal--share-mode');
}

function handleFileInputChangePost(this: any) {
  const fr = new FileReader();

  fr.readAsDataURL(this.files[0]);

  const loadEvent = function (e: ProgressEvent<FileReader>) {
    const result = fr.result;

    addModalFileToShareMode();

    if (addPostShareBtn) {
      addPostShareBtn.addEventListener('click', () => {
        if (typeof result === 'string') {
          createPost(result, addPostModalTextarea.value);
        }

        addPostModalTextarea.value = '';
        addModalShareToFileMode();
      },
        { once: true }
      );
    }

    const modalImg = addPostModalPost && addPostModalPost.querySelector('.modal__image');

    if (modalImg && typeof result === 'string') {
      modalImg.setAttribute('src', result);
    }
  };

  fr.addEventListener('load', loadEvent);
}