import React, { useState, useEffect } from "react";

import axios from 'axios';

// mui components
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";


const TagsAutoComplete = ({ onSelect }) => {

    const [options, setOptions] = useState([{"title_slug": "code", "title": "code", "uuid": "test1"}, {"title_slug": "tree", "title": "tree", "uuid": "test2"}, {"title_slug": "house", "title": "house", "uuid": "test3"},]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {

        if (!inputValue) {
            setOptions([]);
            return;

        }


        const fetchOptions = async () => {

            setLoading(true);

            try {

                const response = await axios.get("/api/tag-search/", {
                    params: {tags: inputValue},
                });

                setOptions(response.data.found_matches);

            } catch (error) {

                console.error("Ошибка поиска тега:", error);

            } finally {

                setLoading(false);

            }
        };

        const debounceTimerId = setTimeout(() => {
            fetchOptions();
        }, 400);

        return () => clearTimeout(debounceTimerId);


        }, [inputValue])

    return (<Autocomplete
                    options={ options }
                    getOptionLabel={ (option) => option?.title || "" }
                    renderOption={(props, option) => (
                        <li {...props}>
                          {option.title} ({option.records_count})
                        </li>
                    )}
                    loading={loading}
                    inputValue={inputValue}
                    value={selectedOption}

                    onInputChange={ (e, newInputValue) => setInputValue(newInputValue) }

                    onChange={ (e, valueObject) => {

                        setInputValue("");
                        setOptions([]);

                        // Очистка поля после выбора варианта
                        setSelectedOption(null);

                        if (onSelect && valueObject) {

                            onSelect(valueObject.title_slug);

                        }

                        }
                    }


                    sx={{

                        '&.MuiAutocomplete-root': {
                          width: '100%',
                        },
                    }}

                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tags search"
                            sx={{
                              '& input': { fontSize: "1rem" }, // размер шрифта для внутреннего input
                              '& .MuiInputLabel-root': { fontSize: "1rem" }, // размер шрифта метки, если есть
                            }}
                            InputLabelProps={{
                              style: { fontSize: "1rem" },
                            }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                    { loading && <CircularProgress size={20} /> }
                                    { params.InputProps.endAdornment }
                                    </>
                                ),

                            }}
                        />
                    )}
           />);

}


export default TagsAutoComplete;