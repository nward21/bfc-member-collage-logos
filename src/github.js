const REPO_OWNER = 'nward21';
const REPO_NAME = 'bfc-member-collage-logos';
const FILE_PATH = 'members.json';

export function getGitHubToken() {
  return localStorage.getItem('github_token');
}

export function setGitHubToken(token) {
  localStorage.setItem('github_token', token);
}

export function clearGitHubToken() {
  localStorage.removeItem('github_token');
}

export async function saveToGitHub(members, tiers) {
  const token = getGitHubToken();
  if (!token) {
    throw new Error('No GitHub token configured');
  }

  const content = JSON.stringify({ members, tiers }, null, 2);
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  // First, get the current file to get its SHA
  const getResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!getResponse.ok && getResponse.status !== 404) {
    throw new Error('Failed to fetch current file');
  }

  const currentFile = getResponse.status === 404 ? null : await getResponse.json();

  // Update the file
  const updateResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update members via dashboard',
        content: encodedContent,
        sha: currentFile?.sha,
      }),
    }
  );

  if (!updateResponse.ok) {
    const error = await updateResponse.json();
    throw new Error(error.message || 'Failed to save to GitHub');
  }

  return await updateResponse.json();
}

export async function validateToken(token) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    return false;
  }

  const user = await response.json();
  return user.login === REPO_OWNER;
}
