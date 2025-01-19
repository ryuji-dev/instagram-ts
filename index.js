var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// initial user profile
var defaultProfile = {
    id: "hello.world",
    img: "assets/default_profile.svg",
    name: "헬로월드",
    description: "안녕하세요! 저는 헬로월드입니다.",
    link: "https://www.instagram.com/hello.world",
    posts: 0,
    followers: 103,
    following: 96,
};
// constant elements
var profileImg = document.getElementById('profile-img');
var profileId = document.getElementById('profile-id');
var profilePosts = document.getElementById('profile-posts');
var profileFollowers = document.getElementById('profile-followers');
var profileFollowing = document.getElementById('profile-following');
var profileName = document.getElementById('profile-name');
var profileDescription = document.getElementById('profile-description');
var profileLink = document.getElementById('profile-link');
var updateProfileImg = document.getElementById('update-profile-img');
var updateProfileId = document.getElementById('update-profile-id');
var updateProfileName = document.getElementById('update-profile-name');
var updateProfileDescription = document.getElementById('update-profile-description');
var updateProfileFile = document.getElementById("update-profile-file");
var updateProfileSave = document.getElementById("update-profile-save");
var updateProfileLink = document.getElementById('update-profile-link');
var updateProfileBtn = document.getElementById('update-profile-btn');
var updateProfileModal = document.querySelector(".update-profile-modal");
var updateProfileCloseBtn = null;
if (updateProfileModal) {
    updateProfileCloseBtn = updateProfileModal.querySelector('.modal__close-button');
}
window.addEventListener('load', function () {
    initEvents();
    updateProfileUI();
});
function initEvents() {
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', function () { return updateProfileModal && updateProfileModal.showModal(); });
    }
    if (updateProfileSave) {
        updateProfileSave.addEventListener('click', handleUpdateProfileSave);
        if (updateProfileCloseBtn) {
            updateProfileCloseBtn.addEventListener("click", function () {
                updateProfileUI();
            });
        }
        if (updateProfileFile)
            updateProfileFile.addEventListener("change", handleFileInputChangeProfile);
    }
}
function updateUI() {
    updateProfileUI();
}
function updateProfileUI() {
    var profileString = localStorage.getItem('profile');
    var postsString = localStorage.getItem('posts');
    var profile = (typeof profileString === 'string' && JSON.parse(profileString)) || defaultProfile;
    var posts = (typeof postsString === 'string' && JSON.parse(postsString)) || [];
    document.title = "".concat(profile.name, " (@").concat(profile.id, ") - Instagram");
    profile.posts = posts.length;
    if (profileImg && profileId && profilePosts && profileFollowers && profileFollowing && profileName && profileDescription && profileLink) {
        profileImg.setAttribute("src", profile.img);
        profileId.innerText = profile.id;
        var profilePostsStrong = profilePosts.querySelector('strong');
        if (profilePostsStrong)
            profilePostsStrong.innerText = profile.posts;
        var profileFollowersStrong = profileFollowers.querySelector("strong");
        if (profileFollowersStrong)
            profileFollowersStrong.innerText = profile.followers;
        var profileFollowingStrong = profileFollowing.querySelector("strong");
        if (profileFollowingStrong)
            profileFollowingStrong.innerText = profile.following;
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
    var profileString = localStorage.getItem('profile');
    var _a = (typeof profileString === 'string' && JSON.parse(profileString)) || defaultProfile, id = _a.id, img = _a.img, name = _a.name, description = _a.description, link = _a.link, rest = __rest(_a, ["id", "img", "name", "description", "link"]);
    if (!(updateProfileImg && updateProfileId && updateProfileName && updateProfileDescription && updateProfileLink))
        return;
    var newProfile = __assign({ id: updateProfileId.value, img: updateProfileImg.getAttribute("src"), name: updateProfileName.value, description: updateProfileDescription.value, link: updateProfileLink.value }, rest);
    localStorage.setItem('profile', JSON.stringify(newProfile));
    updateProfileUI();
}
function handleFileInputChangeProfile() {
    var fr = new FileReader();
    fr.readAsDataURL(this.files[0]);
    var loadEvent = function (e) {
        if (updateProfileImg) {
            var result = fr.result;
            if (typeof result === 'string') {
                updateProfileImg.setAttribute("src", result);
            }
        }
    };
    fr.addEventListener("load", loadEvent);
}
function whichDialogOpen() {
    var allDialogs = Array.from(document.querySelectorAll('dialog.post-modal'));
    if (!allDialogs)
        return;
    var openedDialog = allDialogs.find(function (_a) {
        var open = _a.open;
        return open;
    });
    var parent = openedDialog && openedDialog.parentNode;
    if (parent)
        return parent.id;
}
