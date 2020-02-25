-- Course: CS340
-- Date: 02/21/2020
-- Team: Team 7, Fighting Flamingos
-- Name: Jacob Anderson, John Rudolph

-- Note: the ":" character denotes variables input by the end user via an HTML form


/******************************************
Queries for Browse States Page
*******************************************/
--Main query, populates the HTML table of states.
select st.state, st.state_id, NVL(ar.area_count, 0) as area_count
from States st
left join (
	select count(area_id) area_count, state_id from Areas group by state_id
) ar on ar.state_id = st.state_id
order by st.state asc;

--Form query, adds a new state to the States database table
insert into States (state) values (:inputName);


/******************************************
Queries for Browse Areas Page
*******************************************/
--Main query, populates the HTML table of areas.
--Note: The where clause is optional, and is only included if a state_id is
--      passed via the URL
select ar.area_id, ar.state_id, ar.name, ar.approach, st.state,
NVL(rt.route_count, 0) as route_count
from Areas ar left join States st on ar.state_id = st.state_id
left join (
	select count(route_id) as route_count, area_id from Routes group by area_id
) rt on rt.area_id = ar.area_id
where ar.state_id = :passedStateId
order by st.state asc, ar.name asc;
	
--State query, populates the "State" drop down list in the "Add New Area" form.
--Note: The where clause is optional, and is only included if a state_id is
--      passed via the URL
select state, state_id
from States
where state_id = :passedStateId
order by state asc;

--Form query, adds a new area to the Areas database table
insert into Areas (name, approach, state_id) values (:inputName, :inputApproach, :inputStateId);


/******************************************
Queries for Browse Routes Page
*******************************************/
--Main query, populates the HTML table of routes.
--Note: The where clause is optional, and is only included if an area_id is
--      passed via the URL
select rt.route_title, rt.route_id, rt.area_id, rt.overview, rt.grade, rt.type, rt.approach,
rt.latitude, rt.longitude, rt.first_ascent, rt.first_ascent_date, rt.pitch_count, ar.name,
st.state, ur.rating, NVL(ur.rating_count, 0) as rating_count
from Routes rt
left join Areas ar on ar.area_id = rt.area_id
left join States st on st.state_id = ar.state_id
left join (
	select
	route_id,
	round(avg(rating),1) as rating,
	count(rating) as rating_count
	from Users_Routes
	group by route_id
	) ur on ur.route_id = rt.route_id
where rt.area_id = :passedAreaId
order by ar.name asc, rt.route_title asc;
	
--Area query, populates the "Area" drop down list in the "Add New Route" form.
--Note: The where clause is optional, and is only included if an area_id is
--      passed via the URL
select name, area_id
from Areas
where area_id = :passedAreaId
order by name asc;

--Form query, adds a new route to the Routes database table
insert into Routes
(route_title, area_id, overview, grade, type, approach, latitude, longitude, first_ascent, first_ascent_date, pitch_count)
values (:inputTitle, :inputAreaId, :inputOverview, :inputGrade, :inputType, :inputApproach, :inputLatitude,
:inputLongitude, :inputFirstAscent, :inputFirstAscentDate, :inputPitchCount);


/******************************************
Queries for Route Details Page
*******************************************/
-- Directed to page when click link of Route Name in Area Browse page
select rt.route_title, rt.route_id, rt.area_id, rt.overview, rt.grade, rt.type, rt.approach,
	rt.latitude, rt.longitude, rt.first_ascent, rt.first_ascent_date, rt.pitch_count, ar.name, 
	st.state, ur.rating, ur.rating_count
	from Routes rt
	left join Areas ar on ar.area_id = rt.area_id
	left join States st on st.state_id = ar.state_id
		left join (
			select
			route_id,
			round(avg(rating),1) as rating,
			count(rating) as rating_count
				from Users_Routes
				group by route_id
		) ur on ur.route_id = rt.route_id;


/******************************************
Queries for Login Page
*******************************************/
-- login query for existing user
select user_id, username, password, first_name, last_name 
from Users 
where username= :? and password= :?;

-- New user sign up
insert into Users
(first_name, last_name, username, password, state_id)
values (:firstName, :lastName, :userName, :password, :stateId);


/******************************************
Queries for profile Page
*******************************************/
-- Display name at top of page
select fist_name, last_name 
from Users 
where user_id = :loggedInUser;

--Display Route Rating
select Users_Routes.rating, Routes.route_title
from Users_Routes 
left join Routes on Routes.route_id = Users_Routes.route_id
where Users_Routes.user_id = :loggedInUser;


--Update User info
update Users
set first_name = :newFirstName, last_name = :newLastName, state_id = :newStateId
where user_id = :loggedInUser;

--Delete User
delete from Users
where user_id = :loggedInUser;

--Update Route Rating
update Users_Routes 
set rating = :newRating
where user_id = :loggedInUser;

--Delete Route Rating
delete from Users_Routes
where user_id = :loggedInUser;