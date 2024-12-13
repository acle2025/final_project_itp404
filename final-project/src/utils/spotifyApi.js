export async function fetchAlbums(token, albumIds) {
    const results = await fetch(`https://api.spotify.com/v1/albums/${albumIds}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return await results.json();
}
