from email.policy import default

from django.db import models
from django.urls import reverse
from imagekit.models import ProcessedImageField
from slugify import slugify
from transliterate import translit


def slugify_rus(text):
    try:
        return slugify(translit(text, 'ru', reversed=True))
    except Exception:
        return slugify(text)

class AboutMain(models.Model):
    cnt_people = models.CharField(
        max_length=50,
        verbose_name="Кол-во человек в команде"
    )

    cnt_year = models.CharField(
        max_length=50,
        verbose_name="Кол-во лет работы в сфере"
    )

    cnt_square = models.CharField(
        max_length=50,
        verbose_name="Кол-во кв.метров чистки"
    )

    cnt_reviews= models.CharField(
        max_length=50,
        verbose_name="Кол-во положительных отзывов",
        default="25 000",
        help_text="Число на странице 'О компании' в подзаголовке 'довольными остались свыше 25 000 человек!'"
    )

    class Meta:
        verbose_name = "Информация о компании"
        verbose_name_plural = "Информация о компании"

    def __str__(self):
        return f"{self.cnt_people} | {self.cnt_year} | {self.cnt_square} | {self.cnt_reviews}"


class ScopeServices(models.Model):
    name = models.CharField(max_length=250, verbose_name="Название сферы услуг")

    class Meta:
        verbose_name = "Сфера услуг"
        verbose_name_plural = "Сферы услуг"

    def __str__(self):
        return self.name


class Services(models.Model):
    scope = models.ForeignKey(
        ScopeServices, on_delete=models.CASCADE, verbose_name="Сфера"
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        db_index=True,
        verbose_name="URL",
        editable=False,
        blank=True
    )
    desc = models.TextField(verbose_name="Описание")
    gradient = models.TextField(
        verbose_name="Цвет карточки",
        help_text = "От светлого к темному: gradient-1, gradient-2, gradient-3, gradient-4"
    )
    time_work = models.CharField(max_length=150, verbose_name="Часы работы")
    square = models.CharField(max_length=150, verbose_name="Площадь работы")
    order = models.IntegerField(
        default=1,
        verbose_name="порядок",
    )

    photo = ProcessedImageField(
        upload_to="services",
        format="WEBP",
        options={"quality": 80},
        verbose_name="Фото",
        null = True,
        blank=True,
    )

    video = models.FileField(
        upload_to="videos",
        null = True,
        blank=True,
    )

    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"

    def __str__(self):
        return self.scope.name

    def _generate_unique_slug(self):
        base_slug = slugify_rus(self.scope.name)
        slug = base_slug
        counter = 1
        while Services.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    def get_absolute_url(self):
        return reverse("service_detail", kwargs={"slug": self.slug})

    def save(self, *args, **kwargs):
        if not self.slug or self.slug == '':
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)

class AdditionalServices(models.Model):
    scope = models.ForeignKey(
        ScopeServices,
        on_delete=models.CASCADE,
        verbose_name="Сфера"
    )

    desc = models.TextField(
        max_length=150,
        verbose_name="Описание дополнительной услуги"
    )

    class Meta:
        verbose_name = "Дополнительная услуга"
        verbose_name_plural = "Дополнительные услуги"

    def __str__(self):
        return f"{self.scope.name} | {self.desc}"

class ServiceInclusion(models.Model):
    service = models.ForeignKey(
        Services,
        related_name="inclusions",
        on_delete=models.CASCADE,
        verbose_name="Услуга",
    )
    header = models.CharField(max_length=255, verbose_name="Заголовок")
    description = models.TextField(verbose_name="Описание")

    class Meta:
        verbose_name = "Что входит в услугу"
        verbose_name_plural = "Что входит в услугу"

    def __str__(self):
        return self.header


class OrderInfo(models.Model):
    cnt_order = models.IntegerField(verbose_name="Кол-во выполненных заказов")

    class Meta:
        verbose_name = "Информация о заказе"
        verbose_name_plural = "Информация о заказах"

    def __str__(self):
        return f"Кол-во выполненных заказов: {self.cnt_order}"


class Order(models.Model):
    scope = models.ForeignKey(
        ScopeServices, on_delete=models.CASCADE, verbose_name="Сфера"
    )
    entity = models.CharField(
        max_length=150,
        verbose_name="Сущность",
        help_text="Например, юр.лицо или физ.лицо",
    )
    square = models.CharField(max_length=150, verbose_name="Площадь работы")
    photo = ProcessedImageField(
        upload_to="orders", format="WEBP", options={"quality": 80}, verbose_name="Фото"
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return self.scope.name


class QuestionAnswer(models.Model):
    question = models.TextField(verbose_name="Вопрос")
    answer = models.TextField(verbose_name="Ответ")

    class Meta:
        verbose_name = "Вопрос-Ответ"
        verbose_name_plural = "Вопросы-Ответы"

    def __str__(self):
        return f"{self.question} - {self.answer}"


class Contact(models.Model):
    phone = models.CharField(max_length=50, verbose_name="Телефон", blank=True)
    city = models.CharField(max_length=100, verbose_name="Город", blank=True)
    address = models.CharField(max_length=255, verbose_name="Адрес", blank=True)
    work_schedule = models.CharField(
        max_length=255, verbose_name="График работы", blank=True
    )
    email = models.EmailField(verbose_name="Электронная почта", blank=True)

    class Meta:
        verbose_name = "Контактная информация"
        verbose_name_plural = "Контактная информация"

    def __str__(self):
        return self.address


class CompanyDetails(models.Model):
    calc_account = models.CharField(
        max_length=100, verbose_name="Расчётный счёт", blank=True
    )
    TIN = models.CharField(max_length=100, verbose_name="ИНН", blank=True)
    bank = models.CharField(max_length=100, verbose_name="Название Банка", blank=True)
    BIC = models.CharField(max_length=100, verbose_name="БИК", blank=True)
    correspondent_account = models.CharField(
        max_length=100, verbose_name="Корреспондентский счёт", blank=True
    )
    name = models.CharField(max_length=100, verbose_name="Наименование", blank=True)

    class Meta:
        verbose_name = "Реквизиты"
        verbose_name_plural = "Реквизиты"

    def __str__(self):
        return self.name


class Feedback(models.Model):
    name = models.CharField(max_length=250, verbose_name="Имя")
    phone = models.CharField(max_length=50, verbose_name="Телефон")
    message = models.TextField(verbose_name="Сообщение/вопрос", null=True, blank=True)

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        return f"{self.name} | {self.phone}"


class VideoMain(models.Model):
    name = models.TextField(verbose_name="Заголовок к видео")
    video = models.FileField(upload_to="videos")
    order = models.IntegerField(
        verbose_name="Порядок",
        default=1,
    )

    class Meta:
        verbose_name = "Видео на главном экране"
        verbose_name_plural = "Видео на главном экране"

    def __str__(self):
        return self.name


class Employee(models.Model):
    photo = ProcessedImageField(
        upload_to="employee",
        format="WEBP",
        options={"quality": 80},
        verbose_name="Фото",
    )
    name = models.TextField(verbose_name="ФИО")
    position = models.CharField(max_length=500, verbose_name="Должность")
    description = models.TextField(blank=True, verbose_name="Описание")
    experience = models.PositiveSmallIntegerField(
        blank=True, null=True, verbose_name="Стаж"
    )
    order = models.IntegerField(
        default=1,
        verbose_name="Порядок"
    )

    class Meta:
        verbose_name = "Сотрудник компании"
        verbose_name_plural = "Сотрудники компании"

    def __str__(self):
        return self.name

    def experience_display(self):
        if self.experience is None:
            return

        n = self.experience
        if 11 <= n % 100 <= 14:
            word = "лет"
        else:
            last_digit = n % 10
            if last_digit == 1:
                word = "год"
            elif last_digit in (2, 3, 4):
                word = "года"
            else:
                word = "лет"
        return f"{n} {word}"

class Logo(models.Model):
    photo = ProcessedImageField(
        upload_to="logo", format="WEBP", options={"quality": 80}, verbose_name="Лого"
    )

    class Meta:
        verbose_name = "Лого для блока Нас Выбирают"
        verbose_name_plural = "Лого для блока Нас Выбирают"


class SocialNetwork(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название соцсети")
    url = models.URLField(verbose_name="Ссылка на соцсеть", null=True, blank=True)

    class Meta:
        verbose_name = "Социальная сеть"
        verbose_name_plural = "Социальные сети"

    def __str__(self):
        return self.name
