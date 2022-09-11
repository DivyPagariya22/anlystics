import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import moment from "moment";

export default function Home() {
  const [allData, setAllData] = useState([]);
  const [allUser, setAllUser] = useState([]);

  const structureData = (data, req) => {
    let obj = {};
    if (req == "w") {
      for (let i = 7; i >= 0; i--) {
        const date = moment().subtract(i, "d").format();
        date = moment(date).format("YYYY_MM_DD");
        obj[date] = obj[date] || 0;
      }
    }

    if (req == "M") {
      for (let i = 30; i >= 0; i--) {
        const date = moment().subtract(i, "d").format();
        date = moment(date).format("YYYY_MM_DD");
        obj[date] = obj[date] || 0;
      }
    }

    for (let i = 0; i < data.length; i++) {
      let d = data[i].created_at;
      d = moment(d).format("YYYY_MM_DD");
      obj[d] = obj[d] || 0;
      obj[d]++;
    }
    let res = Object.entries(obj);
    return res;
  };

  async function getDates(req) {
    const dateTo = moment().format();
    const dateFrom = moment().subtract(1, req).format();
    const { data: myData, error: myErr } = await supabase
      .from("subscriber_messages")
      .select("created_at")
      .match({ community: "divy.trycasa.app" })
      .lte("created_at", dateTo)
      .gte("created_at", dateFrom);
    setAllData(structureData(myData, req));
  }

  const structureUser = (data, req) => {
    let obj = {};
    if (req == "w") {
      for (let i = 7; i > 0; i--) {
        const date = moment().subtract(i, "d").format();
        date = moment(date).format("YYYY_MM_DD");
        // let user = [];
        // const temp = { date: date, user: user };
        // obj.push(temp);
        obj[date] = new Set();
      }
    }

    if (req == "M") {
      for (let i = 30; i > 0; i--) {
        const date = moment().subtract(i, "d").format();
        date = moment(date).format("YYYY_MM_DD");
        // let user = [];
        // const temp = { date: date, user: user };
        // obj.push(temp);
        obj[date] = new Set();
      }
    }

    console.log(obj);

    for (let i = 0; i < data.length; i++) {
      let d = data[i].created_at;
      d = moment(d).format("YYYY_MM_DD");
      console.log(d);
      obj[d].add(data[i].subscriber);
    }

    let res = [];
    for (const key in obj) {
      let temp = obj[key].size;
      res.push({ date: key, counts: temp });
    }
    return res;
  };

  async function getActiveUsers(req) {
    const dateTo = moment().format();
    const dateFrom = moment().subtract(1, "M").format();
    const { data: myData, error: myErr } = await supabase
      .from("subscriber_messages")
      .select("created_at, subscriber")
      .match({ community: "divy.trycasa.app" })
      .lte("created_at", dateTo)
      .gte("created_at", dateFrom);

    setAllUser(structureUser(myData, "M"));

    console.table(allUser);
  }

  return (
    <div className='container' style={{ padding: "50px 0 100px 0" }}>
      <select onChange={(e) => getDates(e.target.value)}>
        <option value='w'>Week</option>
        <option value='M'>Month</option>
      </select>

      <br />

      <button onClick={getActiveUsers}>Get Active User</button>

      <br />

      {allData.map((i) => {
        return (
          <div>
            <h1>{i[0]}</h1>
            <h4>{i[1]}</h4>
          </div>
        );
      })}
    </div>
  );
}
