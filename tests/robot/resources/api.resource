*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource    api_keywords.robot

*** Keywords ***

Generate Proof
    [Arguments]    ${birth_date}    ${min_age}    ${country_code}=${None}    ${circuit_id}=${None}
    ${body}=    Create Dictionary    birthDate=${birth_date}    minAge=${min_age}
    Run Keyword If    ${country_code} != ${None}    Set To Dictionary    ${body}    countryCode=${country_code}
    Run Keyword If    ${circuit_id} != ${None}    Set To Dictionary    ${body}    circuitId=${circuit_id}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    api    /api/v1/proofs/generate    json=${body}    headers=${headers}
    [Return]    ${response}

Verify Proof
    [Arguments]    ${proof_id}    ${proof}
    ${body}=    Create Dictionary    proofId=${proof_id}    proof=${proof}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    api    /api/v1/proofs/verify    json=${body}    headers=${headers}
    [Return]    ${response}

Get Proof
    [Arguments]    ${proof_id}
    ${response}=    GET On Session    api    /api/v1/proofs/${proof_id}
    [Return]    ${response}

Revoke Proof
    [Arguments]    ${proof_id}
    ${response}=    DELETE On Session    api    /api/v1/proofs/${proof_id}
    [Return]    ${response}

Issue Credential
    [Arguments]    ${holder_id}    ${age_verified}    ${min_age}    ${country_code}=${None}
    ${body}=    Create Dictionary    holderId=${holder_id}    ageVerified=${age_verified}    minAge=${min_age}
    Run Keyword If    ${country_code} != ${None}    Set To Dictionary    ${body}    countryCode=${country_code}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    api    /api/v1/credentials/issue    json=${body}    headers=${headers}
    [Return]    ${response}

Verify Credential
    [Arguments]    ${credential_id}
    ${body}=    Create Dictionary    credentialId=${credential_id}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    api    /api/v1/credentials/verify    json=${body}    headers=${headers}
    [Return]    ${response}
