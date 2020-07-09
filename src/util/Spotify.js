let accessToken;
const clientId = '20fcb44a38f84e6189c6ec11c62da9e3';
const redirectUri = "http://localhost:3000/";
export const Spoty = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresTime = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresInMatch * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = url;
        }
    },
    search(term) {
        const accessToken = Spoty.getAccessToken();
        fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(result => {
            return result.json();
        }).then(response => {
            if (!response.tracks) {
                return [];
            }
            return response.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                };
            })
        });
    },
    savePlaylist(name, uriArray) {
        if (!name || !uriArray.length) {
            return;
        }
        let aToken = Spoty.getAccessToken();
        let headers = { Authorization: `Bearer ${accessToken}` };
        let UserId;
        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(result => result.json()).then(result => {
            UserId = result.id;
            return fetch(`https://api.spotify.com/v1/users/${UserId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json()).then(result => {
                const playlistId = result.id;
                return fetch(`https://api.spotify.com/v1/users/${UserId}/playlists/${playlistId}/track`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: uriArray })
                });
            })
        })
    }
};