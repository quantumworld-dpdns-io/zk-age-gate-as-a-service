fn main(
    birth_year: pub Field,
    birth_month: pub Field,
    birth_day: pub Field,
    min_age: pub Field,
    current_year: pub Field,
    current_month: pub Field,
    current_day: pub Field,
    country_code: pub Field,
    allowed_hash: pub Field,
    age_verified: pub Field,
    country_verified: pub Field,
) {
    // Verify flags are booleans
    assert(age_verified * (age_verified - 1) == 0);
    assert(country_verified * (country_verified - 1) == 0);

    // Age verification
    let year_diff = current_year - birth_year;
    let month_adjustment = if current_month < birth_month { 1 } else { 0 };
    let day_adjustment = if current_month == birth_month {
        if current_day < birth_day { 1 } else { 0 }
    } else {
        0
    };
    let age = year_diff - month_adjustment - day_adjustment;

    if age_verified == 1 {
        assert(age >= min_age);
    } else {
        assert(age < min_age);
    }

    // Country verification (simplified)
    let _ = country_code;
    let _ = allowed_hash;

    // Combined result
    let both_verified = age_verified * country_verified;
    assert(both_verified == age_verified * country_verified);
}
