const CATEGORY_TITLES = {
  'web framework': 'Web Framework',
  'test framework': 'Test Framework',
  logger: 'Logger',
  'database driver': 'Database Driver',
  'command line interface': 'Command Line Interface',
}

const onError = (response) => {
  const errorMessage = response.responseText
  alert(errorMessage)
}

const showLanguages = (languages) => {
  const languageSelect = $('#languageSelect')
  languages.forEach(function (language) {
    languageSelect.append($('<option>').prop('value', language).text(language))
  })
}

const renderCheckboxes = (libraries) => {
  const checkboxContainer = $('#checkboxContainer')
  checkboxContainer.empty()

  checkboxContainer.append($('<h2>').text('Select libraries:'))

  const uniqueCategories = Array.from(new Set(libraries.map((library) => library.category)))
  uniqueCategories.forEach((category) => {
    const categoryDiv = $('<div>')
    const categoryTitle = $('<h4>').text(`${CATEGORY_TITLES[category]}:`)
    categoryDiv.append(categoryTitle)

    libraries
      .filter((library) => library.category === category)
      .forEach((library) => {
        const label = $('<label>')
        const input = $('<input>').prop('type', 'checkbox').prop('name', library.category).val(library.packageName)
        label.append(input, library.packageName)
        categoryDiv.append(label)

        categoryDiv.append('<br>')
        checkboxContainer.append(categoryDiv)
      })
  })

  checkboxContainer.find('input[type="checkbox"]').on('click', function () {
    $('#downloadZip').show()
  })
}

const loadLanguages = () => {
  $.ajax({
    url: 'http://localhost:9000/api/v1/languages',
    type: 'GET',
    headers: {
      'x-session-id': sessionId,
    },
    success: (response) => {
      showLanguages(response)
    },
    error: onError,
  })
}

const loadCheckboxes = () => {
  // const selectedLanguage = $(this).val() TODO add it as queryParam
  $.ajax({
    url: 'http://localhost:9000/api/v1/libs',
    type: 'GET',
    headers: {
      'x-session-id': sessionId,
    },
    success: (response) => {
      renderCheckboxes(response)
    },
    error: onError,
  })
}

let sessionId
$(document).ready(function () {
  const $inputProjectName = $('#inputProjectName')
  const $languageSelect = $('#languageSelect')
  const $downloadZip = $('#downloadZip')

  $.ajax({
    url: 'http://localhost:9000/api/v1/sessions',
    type: 'POST',
    success: function (response) {
      sessionId = response.id
      loadLanguages()
      loadCheckboxes()
    },
    error: onError,
  })

  $languageSelect.on('change', loadCheckboxes)

  $inputProjectName.on('input', () => {
    const projectName = $inputProjectName.val()
    if (projectName && projectName.trim() !== '') {
      $inputProjectName.css('border-color', '')
    }
  })

  $downloadZip.click(() => {
    const selectedLanguage = $languageSelect.val()
    const projectName = $inputProjectName.val()
    const checkboxContainer = $('#checkboxContainer')

    if (!projectName || projectName.trim() === '') {
      $inputProjectName.css('border-color', 'red')
      return
    }

    const selectedLibraries = checkboxContainer
      .find('input[type="checkbox"]:checked')
      .map(function () {
        return {
          category: $(this).attr('name'),
          packageName: $(this).val(),
        }
      })
      .get()

    const payload = {
      selectedLanguage,
      projectName,
      selectedLibraries,
    }

    $.ajax({
      url: 'http://localhost:9000/api/v1/zip',
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        'x-session-id': sessionId,
      },
      contentType: 'application/json',
      success: (response) => {
        window.location = `http://localhost:9000/api/v1/download/${sessionId}`
      },
      error: onError,
    })
  })
})
