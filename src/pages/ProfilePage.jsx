import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../store/slices/profileSlice';
import { useParams } from 'react-router-dom';

import Modal from '../components/Modal';
import PostCard from '../components/PostCard';
import ProfileHeader from '../components/ProfileHeader';

const ProfilePage = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const { userData, stats, posts, loading, hasNext: reduxHasNext } = useSelector((state) => state.profile);

    const [page, setPage] = useState(1);
    const [localPosts, setLocalPosts] = useState({ trips: [], activities: [], listings: [] });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [editAbout, setEditAbout] = useState("");
    const [selectedRole, setSelectedRole] = useState([]);

    const [localHasNext, setLocalHasNext] = useState({ trips: false, activities: false, listings: false });

    useEffect(() => {
        if (!userData || userData.username !== username) {
            dispatch(fetchUserProfile({ username, page: 1 }));
        }
    }, [dispatch, username, userData?.username]);

    useEffect(() => {
        if (page === 1 && posts) setLocalPosts(posts);
        if (userData) {
            setEditAbout(userData.about || "");
            setSelectedRole(userData.roles || ['NORMAL']);
        }
    }, [posts, userData]);

    useEffect(() => {
        if (page === 1) {
            if (reduxHasNext) setLocalHasNext(reduxHasNext);
        }
    }, [reduxHasNext, page]);

    const loadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);

        // Fetch directly to keep it out of Redux
        try {
            const response = await fetchProfileApi(username, nextPage);
            const newData = response.data;

            // Append new data to existing local data
            setLocalPosts(prev => ({
                trips: [...prev.trips, ...newData.trips],
                activities: [...prev.activities, ...newData.activities],
                listings: [...prev.listings, ...newData.listings]
            }));

            // Update flags
            setLocalHasNext(newData.hasNext);
        } catch (error) {
            console.error("Failed to load more");
        }
    };

    const showLoadMoreBtn = localHasNext.trips || localHasNext.activities || localHasNext.listings;

    const handleUpdateAbout = async () => {
        setIsEditOpen(false);
    };

    const handleUpdateRole = async () => {
        setIsSettingsOpen(false);
    };

    if (loading && page === 1) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div></div>;
    if (!userData) return <div className="text-center mt-20 text-slate-500 font-medium">User not found</div>;

    const isNormal = userData.roles.includes('NORMAL');
    const isBusiness = userData.roles.includes('BUSINESS');

    return (
        <div className="max-w-5xl mx-auto bg-slate-50 min-h-screen pb-10">
            <ProfileHeader
                userData={userData}
                stats={stats}
                onEdit={() => setIsEditOpen(true)}
                onSettings={() => setIsSettingsOpen(true)}
            />

            <main className="p-8">
                {isNormal && localPosts.trips.length > 0 && (
                    <section className="mb-10">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Trips</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {localPosts.trips.map(trip => (
                                <PostCard key={trip._id} id={trip._id} title={trip.title} label="Trip" images={trip.images} />
                            ))}
                        </div>
                    </section>
                )}

                {isBusiness && (
                    <>
                        {localPosts.activities.length > 0 && (
                            <section className="mb-10">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Activities</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {localPosts.activities.map(act => (
                                        <PostCard key={act._id} id={act._id} title={act.title} label="Activity" images={act.images} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {localPosts.listings.length > 0 && (
                            <section className="mb-10">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Listings</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {localPosts.listings.map(list => (
                                        <PostCard key={list._id} id={list._id} title={list.title} label="Listing" images={list.images} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
                {showLoadMoreBtn && (
                    <div className="flex justify-center mt-10">
                        <button onClick={loadMore} className="px-8 py-2.5 bg-white border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:shadow-sm transition">
                            Load More
                        </button>
                    </div>
                )}
            </main>

            {/* Modals */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-semibold text-slate-700">Bio / About</label>
                    <textarea
                        rows="4"
                        value={editAbout}
                        onChange={(e) => setEditAbout(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                    <button onClick={handleUpdateAbout} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition mt-2">
                        Save Changes
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Account Settings">
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-semibold text-slate-700">Account Type</label>
                    <select
                        value={selectedRole.includes('BUSINESS') && selectedRole.includes('NORMAL') ? 'MIX' : selectedRole[0]}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedRole(val === 'MIX' ? ['NORMAL', 'BUSINESS'] : [val]);
                        }}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                        <option value="NORMAL">Traveler</option>
                        <option value="BUSINESS">Business Host</option>
                        <option value="MIX">Both</option>
                    </select>
                    <button onClick={handleUpdateRole} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition mt-2">
                        Update Role
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ProfilePage;