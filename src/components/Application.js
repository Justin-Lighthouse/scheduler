import DayList from "components/DayList";
import "components/Application.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Appointment from "components/Apointments";
import * as helpers from "components/helpers/selectors"

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then((all) => {
      let days = all[0].data;
      let appointments = all[1].data;
      let interviewers = all[2].data;
      console.log(all[1].data);
      setState(prev => ({ ...prev, days, appointments, interviewers}))
    });
  }, [])
  

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    console.log(interview)
    console.log("HERE", appointments)
    console.log("MAYBE", appointment)
    console.log("id", )
    return (axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState((prev => ({ ...prev, appointments})));
      })
    )
    // setState((prev => ({ ...prev, appointments})));
  }

  function cancelInterview(id) {
    
  }

  // console.log(helpers.default.getAppointmentsForDay(state, state.day))
  const appsForDay = helpers.default.getAppointmentsForDay(state, state.day);
  const apps = appsForDay.map((appointment) => {
    const intForDay = helpers.default.getInterviewersForDay(state, state.day);
    const interview = helpers.default.getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        bookInterview={bookInterview}
        interviewers={intForDay}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {apps}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
