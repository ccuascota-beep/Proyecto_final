import {useState} from "react";
import {ApiMovie} from "../service/api-movie.js";

import Series
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSeries = async () => {
        try {
            const response = await ApiMovie.get
        }
    }
}