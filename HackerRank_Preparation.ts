/////MEDUIM SELECT
/////////////////////////////
select Max( CASE WHEN occupation='Doctor' THEN name ELSE NULL END )as 'Doctor',
Max( CASE WHEN occupation='Professor' THEN name ELSE NULL END )as 'Professor',
Max( CASE WHEN occupation='Singer' THEN name ELSE NULL END )as 'Singer',
Max( CASE WHEN occupation='Actor' THEN name ELSE NULL END )as 'Actor'
FROM (select*, ROW_NUMBER() over (partition by occupation order by name) as sort_id from occupations) as o
group by o.sort_id;

/////////// CASE
////////////////////////////
select
case 
 when (A=B AND A!=C AND B!=C AND (A+B)>C) OR(C=B AND A!=B AND A!=C AND (A+B)>C) OR(C=A AND A!=B AND B!=C AND (A+B)>C) THEN 'Isosceles' 
 when (A=B and A=C and C=B AND (A+B)>C) THEN 'Equilateral'
 when (A!=C AND A!=B AND C!=B AND (A+B)>C) THEN 'Scalene' 
 else 'Not A Triangle'
end as result
FROM `triangles`;

/////////CONCAT AND UNION
/////////////////////////////
SELECT CONCAT(name,'(',LEFT(occupation,1),')') as response from occupations 
UNION
SELECT CONCAT('There are a total of ',COUNT(Occupation),' ', LOWER(Occupation),'s.') as result from occupations 
group by occupation
order by response ASC ;

////////////////////CASE
////////////////////////////////
select n , CASE 
when  p IS NULL then 'Root' 
when n in (select p from BST) and p!='null' then 'Inner' 
else 'Leaf'
END as result
from BST
order by n ASC;

////////////////////INNER JOIN
//////////////////////////////////
select distinct e.company_code, founder, count(distinct e.lead_manager_code), count(distinct e.senior_manager_code), count(distinct e.manager_code), count(distinct employee_code)
from employee as e
INNER JOIN company as c ON e.company_code=c.company_code
INNER JOIN lead_manager as l ON e.lead_manager_code=l.lead_manager_code
INNER JOIN senior_manager as s ON e.senior_manager_code=s.senior_manager_code
INNER JOIN manager as m ON e.manager_code=m.manager_code
group by e.company_code, founder
order by e.company_code, founder ASC;

/////////////////group by
////////////////////////////////
select (months*salary) as earning, count(employee_id) 
from employee group by earning
order by earning desc
limit 1;

//////////////////sqrt(), pow()
//////////////////////////////////////////////////////////
select round( sqrt(pow(min(lat_n)-max(lat_n),2)+pow(min(long_w)-max(long_w),2)),4) from station;

////////////////OVER(), ROW_NUMBER()
///////////////////////////////////////////////
SELECT ROUND(LAT_N,4)
FROM
(SELECT LAT_N, 
        ROW_NUMBER() OVER(ORDER BY LAT_N) AS ROW_NUM,
        COUNT(*) OVER() AS TOTAL
FROM STATION) AS TABLE1
WHERE ROW_NUM = CEILING(TOTAL/2);

/////////////////SUM
////////////////////////////////
select sum(city.population) from city, country where city.countryCode=country.code and country.continent='Asia';

//////////////////CASE
////////////////////////////////
select (case when g.grade< 8 then NULL else name  end) as 'wanted',g.grade, s.marks
from students as s
join grades as g on s.marks between g.min_mark and g.max_mark
order by g.grade desc, s.name, s.marks;

////////////////requete imbriquée
//////////////////////////////////
select w.id, wp.age, w.coins_needed, w.power
from wands as w
join wands_property as wp on w.code=wp.code
where wp.is_evil=0
and 
coins_needed=(select min(coins_needed) from wands where code=w.code and power=w.power )
order by w.power desc, wp.age desc;

////////////////////creer des tables pour requetes sql, group by
/////////////////////////////////////////////////////////////////

with
tab1 as (
select h.hacker_id, h.name, count(c.hacker_id) as nbre
from hackers as h
join challenges as c on h.hacker_id=c.hacker_id
group by h.name, h.hacker_id
order by count(*) desc, h.hacker_id
    ),
tab2 as(
select nbre,count(*)as cte
from tab1
    group by nbre
    having count(*)=1

)
select tab1.hacker_id, tab1.name, tab1.nbre
from tab1
where tab1.nbre=(select max(tab1.nbre) from tab1)
or tab1.nbre in (select nbre from tab2);

//////////////////requete imbriquée
///////////////////////////////////////////////////
select derived.hacker_id, derived.name, sum(derived.max_score) as total_score
from 
(
select h.hacker_id, h.name,max(s.score) as max_score
from hackers as h, submissions as s 
where h.hacker_id=s.hacker_id
group by h.hacker_id,h.name,s.challenge_id
) as derived
group by derived.hacker_id, derived.name
having total_score <> 0
order by total_score desc, derived.hacker_id;

//////////////////Row_number()
////////////////////////////////////
with t1 as (select start_date, row_number() over(order by start_date ) as c1 from projects where start_date not in (select end_date from projects)),
t2 as (select end_date, row_number() over(order by start_date ) as c2 from projects where end_date not in (select start_date from projects))
select start_date,end_date from t1,t2 where c1=c2 order by datediff(start_date,end_date) desc;

///////////////////// Procédure stockée et impression de triangle
/////////////////////////////////////////////////////////////////

create table stars (star varchar(123));
///procédure stockée
////////////////////
delimiter |
create procedure P(in R int)
begin
declare i int;
set i=R;
while i > 0 do
insert into stars(star) values (repeat('* ', i));
set i= i-1;
end while;
end |
//////appel de la procédure et affichage
////////////////////////////////////////
delimiter ;
call P(20);
select * from stars;
 
///////////////////////Afficher dans l'ordre inverse
/////////////////////////////////////////////////////

create table stars(star varchar(123));
delimiter |
create procedure P(in R int)
begin
declare i int;
set i=1;
while i <= R do
insert into stars(star) values (repeat('* ',i));
set i=i+1;
end while;
end |
delimiter ;
call P(20);
select * from stars;

//////////////////////jointure qui creer une nouvelle table
/////////////////////////////////////////////////////////////

select name
from
students s join friends f on f.id = s.id
join packages p1 on p1.id = s.id
join packages p2 on p2.id = f.friend_id
where p1.salary < p2.salary
order by p2.salary;





