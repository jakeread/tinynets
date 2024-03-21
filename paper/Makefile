DOCNAME=main

all: report

.PHONY: clean

report:
	pdflatex $(DOCNAME).tex
	bibtex $(DOCNAME).aux
	pdflatex $(DOCNAME).tex
	pdflatex $(DOCNAME).tex
	@echo "Word Count:"
	detex $(DOCNAME).tex | wc -w

view: report
	open $(DOCNAME).pdf

clean:
	rm *.blg *.bbl *.aux *.log