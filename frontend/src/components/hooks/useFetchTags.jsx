import { useState, useEffect } from "react";

import axios from 'axios';

const useFetchTags = (tagsSlug, changeTagsList) => {

    const [tagsData, setTagsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {

            setLoading(true);

            try {

                const response = await axios.get("/api/check-tags-validation/", {
                  params: {
                    tags: tagsSlug,
                  }
                });

                const receivedTagsData = response.data.tags;

                setTagsData(receivedTagsData);

                changeTagsList(receivedTagsData.map(tag => tag.title_slug).join(','));

            } catch (error) {

                if (error.response) {

                    console.error('Error:', error.message);

                    }

            } finally {

                setLoading(false);

            }

            }

        fetchTags();

    }, [tagsSlug])

    return { tagsData, loading, error };

}

export default useFetchTags;