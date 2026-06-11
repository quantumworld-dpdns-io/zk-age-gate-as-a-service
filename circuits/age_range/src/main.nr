fn main(
    birth_year: pub Field,
    birth_month: pub Field,
    birth_day: pub Field,
    min_age: pub Field,
    current_year: pub Field,
    current_month: pub Field,
    current_day: pub Field,
    age_verified: pub Field,
) {
    // Verify that age_verified is either 0 or 1
    assert(age_verified * (age_verified - 1) == 0);

    // Calculate age difference in years
    let year_diff = current_year - birth_year;

    // If current month < birth month, subtract 1 from age
    let month_adjustment = if current_month < birth_month { 1 } else { 0 };

    // If current month == birth month and current day < birth day, subtract 1
    let day_adjustment = if current_month == birth_month {
        if current_day < birth_day {
            1
        } else {
            0
        }
    } else {
        0
    };

    let age = year_diff - month_adjustment - day_adjustment;

    // Verify age >= min_age if age_verified is 1
    // or age < min_age if age_verified is 0
    if age_verified == 1 {
        assert(age >= min_age);
    } else {
        assert(age < min_age);
    }
}
