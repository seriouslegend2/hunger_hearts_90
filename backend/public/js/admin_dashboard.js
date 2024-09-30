async function fetchModerators() {
    try {
        const response = await fetch('/admin/getModerators');
        const data = await response.json();
        const moderators = data.moderators;
        
        const moderatorsList = document.getElementById('moderators-list');
        moderatorsList.innerHTML = ''; // Clear the list

        moderators.forEach(moderator => {
            const listItem = document.createElement('li');
            listItem.textContent = `${moderator.username} (Role: ${moderator.role}) `;

            // Ban/Unban Button
            const banButton = document.createElement('button');
            banButton.textContent = moderator.isBanned ? 'Unban' : 'Ban';
            banButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ml-2');
            banButton.onclick = () => toggleBan(moderator._id, !moderator.isBanned);

            // Role Change Dropdown
            const roleDropdown = createRoleDropdown(moderator._id, moderator.role);

            listItem.appendChild(banButton);
            listItem.appendChild(roleDropdown);
            moderatorsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching moderators:', error);
    }
}

async function fetchAdmins() {
    try {
        const response = await fetch('/admin/getAdmins');
        const data = await response.json();
        const admins = data.admins;
        
        const adminsList = document.getElementById('admins-list');
        adminsList.innerHTML = ''; // Clear the list

        admins.forEach(admin => {
            const listItem = document.createElement('li');
            listItem.textContent = `${admin.username} (Role: ${admin.role}) `;

            // Ban/Unban Button
            const banButton = document.createElement('button');
            banButton.textContent = admin.isBanned ? 'Unban' : 'Ban';
            banButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ml-2');
            banButton.onclick = () => toggleBan(admin._id, !admin.isBanned);

            // Role Change Dropdown
            const roleDropdown = createRoleDropdown(admin._id, admin.role);

            listItem.appendChild(banButton);
            listItem.appendChild(roleDropdown);
            adminsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
}

async function fetchDonors() {
    try {
        const response = await fetch('/admin/getDonors');
        const data = await response.json();
        const donors = data.donors;
        
        const donorsList = document.getElementById('donors-list');
        donorsList.innerHTML = ''; // Clear the list

        donors.forEach(donor => {
            const listItem = document.createElement('li');
            listItem.textContent = `${donor.username} `;

            // Ban/Unban Button
            const banButton = document.createElement('button');
            banButton.textContent = donor.isBanned ? 'Unban' : 'Ban';
            banButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ml-2');
            banButton.onclick = () => toggleBanDonor(donor._id, !donor.isBanned);

            listItem.appendChild(banButton);
            donorsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching donors:', error);
    }
}

async function toggleBan(modId, shouldBan) {
    try {
        const response = await fetch(`/admin/toggleBan/${modId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isBanned: shouldBan })
        });

        if (response.ok) {
            fetchModerators();
            fetchAdmins();
            fetchDonors();
        } else {
            console.error('Error toggling ban status');
        }
    } catch (error) {
        console.error('Error toggling ban status:', error);
    }
}


async function toggleBanDonor(donorId, shouldBan) {
    try {
        const response = await fetch(`/donor/toggleBan/${donorId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isBanned: shouldBan })
        });

        if (response.ok) {
            fetchModerators();
            fetchAdmins();
            fetchDonors();
        } else {
            console.error('Error toggling ban status');
        }
    } catch (error) {
        console.error('Error toggling ban status:', error);
    }
}

async function changeRole(modId, newRole) {
    try {
        const response = await fetch(`/admin/changeRole/${modId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });

        if (response.ok) {
            alert('Role updated successfully');
            fetchModerators();
            fetchAdmins();
        } else {
            console.error('Error changing role');
        }
    } catch (error) {
        console.error('Error changing role:', error);
    }
}

function createRoleDropdown(modId, currentRole) {
    const roles = ['moderator', 'admin', 'superuser'];
    const select = document.createElement('select');
    select.classList.add('custom-select', 'custom-select-sm', 'ml-2');

    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        if (role === currentRole) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        const newRole = select.value;
        changeRole(modId, newRole);
    });

    return select;
}

document.addEventListener('DOMContentLoaded', fetchModerators);
document.addEventListener('DOMContentLoaded', fetchAdmins);
document.addEventListener('DOMContentLoaded', fetchDonors);
