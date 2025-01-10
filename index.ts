// initial user profile
const defaultProfile = {
  id: "hello.world",
  img: "assets/default_profile.png",
  name: "헬로월드",
  description: "안녕하세요! 저는 헬로월드입니다.",
  link: "https://www.instagram.com/hello.world",
  posts: 0,
  followers: 103,
  following: 96,
};

// constant elements
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